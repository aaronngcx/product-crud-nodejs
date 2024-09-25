import * as shell from 'shelljs';

// Copy all the view templates
shell.cp('-R', 'src/views', 'dist/');

// copy others static resources and configuration
shell.cp('-R', 'public/', 'dist/');
shell.cp('-R', 'database/', 'dist/');
shell.cp('-R', 'src/config/', 'dist/');

// for deployment, rememeber to create a proper .env file
shell.cp('.env.example', 'dist/');
shell.cp('.env.develop', 'dist/.env');
