import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
  '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭',
  '🤔', '🤐', '😐', '😑', '😶', '😏', '😒', '🙄',
  '😬', '😮', '😯', '😲', '😳', '🥺', '😢', '😭',
  '😤', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩',
  '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌',
  '👐', '🤲', '🤝', '🙏', '✌️', '🤟', '🤘', '👌',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '💔', '💕', '💞', '💗', '💖', '✨', '🔥', '⭐',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🌸', '🌺', '🌻', '🌹', '🌷', '🌿', '🍀', '🌈',
  '😎', '🤩', '🥳', '😴', '🤤', '😵', '🤠', '🥶',
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  children: React.ReactNode;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, children }) => {
  return (
    <Popover placement="top" offset={10}>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl transition-colors"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
