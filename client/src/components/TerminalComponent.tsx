import React from 'react';
import { ReactTerminal, TerminalContextProvider } from 'react-terminal';

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

  const customTheme = {
    themeBGColor: '#1c1917',
    themeToolbarColor: '#e7e5e4',
    themeColor: '#FFFEFC',
    themePromptColor: '#0d9488',
  };

  return (
    <TerminalContextProvider>
      <div className="w-full h-96 pb-4"> 
        <ReactTerminal
          commands={commands}
          welcomeMessage={welcomeMessage}
          errorMessage={errorMessage}
          themes={{
            'my-custom-theme': customTheme,
          }}
          theme="my-custom-theme"
        />
      </div>
    </TerminalContextProvider>
  );
};

export default TerminalComponent;
