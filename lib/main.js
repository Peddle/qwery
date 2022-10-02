const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");
const { exec } = require("child_process");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stderr,
});

const cpy_cmd = (() => {
  if(process.platform === "darwin") {
    return "pbcopy";
  }
  // check if DISPLAY is set
  if(process.env.DISPLAY) {
    return "xclip -selection clipboard";
  }

  return null;
})();



const send_request = async (openai, msg) => {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `The following are some examples of useful bash commands:\n\ndescription: list all files in a directory including hidden files\ncmd: ls -a\n\ndescription: ${msg}`,
    temperature: 0.2,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["description:"]
  });

  return response.data;
};

const get_config = async () => {
  const config_file_location = `${process.env.HOME}/.qwery.json`;

  if(!fs.existsSync(config_file_location)) {
    // create config file
    fs.writeFileSync(config_file_location, JSON.stringify({}));
  }
  const config = JSON.parse(fs.readFileSync(config_file_location, "utf8"));
  if(config.api_key === undefined) {
    // ask for api key
    return new Promise((resolve, reject) => {
      rl.question("Enter your OpenAI API key: ", (answer) => {
        config.api_key = answer;
        fs.writeFileSync(config_file_location, JSON.stringify(config));

        resolve(config)
      })
    })
  }
  else {
    return Promise.resolve(config);
  }
}



const main = async (args) => {
  const config = await get_config();

  const configuration = new Configuration({
    apiKey: config.api_key
  });
  const openai = new OpenAIApi(configuration);


  const query = args.join(" ");
  const response = await send_request(openai, query);

  const cmd = response.choices[0].text.split("cmd: ")[1].trim();

  // show the command to the user and ask if they want to run it
  console.error(`QWERY RESULT: ${cmd}`);

  if(cpy_cmd) {
    rl.question("Copy to clipboard? [y/n]: ", (answer) => {
      if (answer === "y") {
        exec(`echo "${cmd}" | ${cpy_cmd}`);
      }
      rl.close();
    })
  }
  else {
    rl.question("Exec this command? [y/n]: ", (answer) => {
      if (answer === "y") {
        // echo the output to the parent shell
        exec(cmd, (err, stdout, stderr) => {
          if(err) {
            console.error(err);
          }
          else {
            console.log(stdout);
          }
        })

      }

      rl.close();
    })
  }
}

main(process.argv.slice(2));

