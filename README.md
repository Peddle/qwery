# qwery
GPT-3 powered cli tool to help with bash commands you can't remember


https://user-images.githubusercontent.com/8838388/193482761-f1de06f6-635d-4bb1-b6fd-a8e8a4cb8980.mov


eg
```bash
$ qw ffmpeg command to transcode mp4 to mov
QWERY RESULT: ffmpeg -i input.mp4 -c:v libx264 -c:a copy -r 30 -f mov output.mov
Copy to clipboard? [y/n]: 
```

## installation
`git clone` the repository and add bin to your path

in order to use copy to clipboard functionality you'll need to have xclip installed and be in an X environment on linux. Mac gets clipboard copy with no extra steps. If you're on linux with no X environment the qwery still gives the option to write to execute in a separate process.

first time setup will ask for your openai API key to use for queries (obviously openai API usage charges will be applied for usage of this tool)


## usage
`qw [english text describing the command you want]`

## changing api key
to change the api key just edit `$HOME/.qwery.json`


