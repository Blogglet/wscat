import {Command, flags} from '@oclif/command'
import { Input } from '@oclif/parser/lib/args';
import { cli } from 'cli-ux';
import * as WebSocket from 'ws';



class Wscat extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
  }

  static args: Input = [        {
    name: "url",
    required:true,
    description: "url to connect",
    default: "ws://localhost:80"
}]
  private isAlive = false;
  private connection: WebSocket | undefined;

  close() {
    this.connection?.close();
    if (this.isAlive) cli.log("Bye 👋");
    this.isAlive = false;
  }

  private readPromise: Promise<any> | undefined;

  async comunication(){
    this.isAlive = true;
    let value = "";
    while(this.isAlive){
      value = await cli.prompt("",{prompt:"> ",type:'normal'});
      if ( value == "exit" ) this.close();
      else if ( value == "" ) this.connection?.send(value);
    }
  }


  async run() {
    const {args, flags} = this.parse(Wscat);
    cli.action.start(`Connecting to ${args.url} `);
    this.connection = new WebSocket(args.url);
    this.connection.onopen  = () => {cli.action.stop("✔️"); this.comunication();}
    this.connection.onerror = () =>  cli.action.stop("💣ERROR");
    this.connection.onclose = () => this.close();
    this.connection.onmessage = (message) => console.log(`\n${message.data}`);
    
  }
}

export = Wscat
