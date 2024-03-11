import React from 'react';
import { ReactTerminal } from 'react-terminal';

const TerminalComponent: React.FC = () => {
  const commands = {
    help: () => {
      return 'Available commands:\n- help\n- greet <name>\n- clear';
    },
    greet: (...args: string[]) => {
      if (args.length > 0) {
        return `Hello, ${args[0]}!`;
      } else {
        return 'Please provide a name to greet.';
      }
    },
    clear: () => {
        return '';
    },
  };

  const welcomeMessage = 'gigachad';
  const errorMessage = 'Unknown command. Type "help" to see available commands.';

  return (
    <div className="w-10/12 h-96 pt-6">
      <ReactTerminal
        commands={commands}
        welcomeMessage={welcomeMessage}
        errorMessage={errorMessage}
        theme="dark"
      />
    </div>
  );
};

export default TerminalComponent;

