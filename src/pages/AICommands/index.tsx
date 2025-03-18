
import React from 'react';
import CommandCard from './components/CommandCard';
import ExampleCommands from './components/ExampleCommands';
import { useCommandProcessor } from './hooks/useCommandProcessor';

const AICommands = () => {
  const {
    command,
    setCommand,
    messages,
    isProcessing,
    handleSubmit
  } = useCommandProcessor();

  return (
    <div className="container py-6 space-y-6">
      <CommandCard 
        messages={messages}
        isProcessing={isProcessing}
        command={command}
        setCommand={setCommand}
        handleSubmit={handleSubmit}
      />
      
      <ExampleCommands setCommand={setCommand} />
    </div>
  );
};

export default AICommands;
