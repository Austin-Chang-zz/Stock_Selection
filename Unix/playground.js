const { spawn, exec } = require('child_process');
const { stdin, stdout, stderr } = require("node:process");

stdin.on('data', (chunk) => {
    // console.log('got the data from the input terminal : ', chunk.toString('utf-8'));
    stdout.write(`got the data from the input terminal (in process) : ${chunk.toString() }`); //use ` `
});

stdout.write("sending data to the terminal or stdout : ");
stderr.write("sending the stderr data :");

// const subprocess = spawn('echo', ['some string','|', 'tr',' ','\n']);

// subprocess.stdout.on('data', (data) => {
//     console.log(data.toString());
// });

// exec('echo "some string" | tr " " "\n"', (error, stdout, stderr) => {
//     if (error) {
//         console.log(error);
//         return;
//     }
//     console.log(stdout);
//     console.log(`standard error: ${stderr}`
// );
// })