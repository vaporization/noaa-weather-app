import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './DraggableFrame.css';

const DraggableFrame = ({ title, src }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? `Hide ${title}` : `Show ${title}`}
      </button>
      {isOpen && (
        <Draggable handle=".handle">
          <div className="draggable-container">
            <ResizableBox
              width={600}
              height={400}
              minConstraints={[300, 200]}
              maxConstraints={[1200, 800]}
            >
              <div className="resizable-container">
                <div className="handle">{title}</div>
                <div className="iframe-container">
                  <iframe
                    src={src}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={title}
                  ></iframe>
                </div>
              </div>
            </ResizableBox>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default DraggableFrame;
