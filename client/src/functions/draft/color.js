import React, { useState, useRef } from 'react';
import { Editor, EditorState, RichUtils,Modifier } from 'draft-js';
import "draft-js/dist/Draft.css";


var COLORS = [
  { label: "Red", style: "red" },
  { label: "Orange", style: "orange" },
  { label: "Yellow", style: "yellow" },
  { label: "Green", style: "green" },
  { label: "Blue", style: "blue" },
  { label: "Indigo", style: "indigo" },
  { label: "Violet", style: "violet" },
  { label: "Grey", style: "grey" }
];

const colorStyleMap = {
  red: { color: "rgba(255, 0, 0, 1.0)" },
  orange: { color: "rgba(255, 127, 0, 1.0)" },
  yellow: { color: "rgba(180, 180, 0, 1.0)" },
  green: { color: "rgba(0, 180, 0, 1.0)" },
  blue: { color: "rgba(0, 0, 255, 1.0)" },
  indigo: { color: "rgba(75, 0, 130, 1.0)" },
  violet: { color: "rgba(127, 0, 255, 1.0)" },
  grey: { color: "rgba(75, 0, 130, 1.0)" }
};



class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}



const _toggleColor = (toggledColor, editorState, setEditorState) => {
  const selection = editorState.getSelection();

  // Let's just allow one color at a time. Turn off all active colors.
  const nextContentState = Object.keys(colorStyleMap).reduce(
    (contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color);
    },
    editorState.getCurrentContent()
  );
  let nextEditorState = EditorState.push(
    editorState,
    nextContentState,
    "change-inline-style"
  );
  const currentStyle = editorState.getCurrentInlineStyle();
  // Unset style override for current color.
  if (selection.isCollapsed()) {
    nextEditorState = currentStyle.reduce((state, color) => {
      return RichUtils.toggleInlineStyle(state, color);
    }, nextEditorState);
  }

  //console.log(currentStyle)

  // If the color is being toggled on, apply it.
  if (!currentStyle.has(toggledColor)) {
    nextEditorState = RichUtils.toggleInlineStyle(
      nextEditorState,
      toggledColor
    );
  }

  setEditorState(nextEditorState);
};

function MyEditor() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editor = useRef(null);

  const toggleInlineStyle = (event) => {
    event.preventDefault();
    let style = event.currentTarget.getAttribute('data-style');
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  }

  
const ColorControls = (props) => {
  const { editorState, setEditorState } = props;

  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div>
      {COLORS.map((type) => (
        <StyleButton
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={() =>
            props.onToggle(type.style, editorState, setEditorState)
          }
          style={type.style}
        />
      ))}
    </div>
  );
};

  var inlineStyleButtons = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" }
  ];

const renderInlineStyleButton = (label, style) => {
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);
  let className = '';
  if (currentBlockType) {
    className = 'active';
  }
  
  return (
    <input
      type="button"
      key={style}
      value={label}
      className={className}
      data-style={style}
      onMouseDown={toggleInlineStyle}
    />
  );

}

  return (
    <div>

      <ColorControls
        editorState={editorState}
        setEditorState={setEditorState}
        onToggle={_toggleColor}
      />


<div className="my-little-app">
      <h1>Playing with Draft!</h1>
      <div className="inline-style-options">
        Inline Styles:
        {inlineStyleButtons.map((button) => {
          return renderInlineStyleButton(button.value, button.style);
        })}
      </div>
      <div style={{
        border: '1px solid #252525',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
      }}>
        <Editor
         customStyleMap={colorStyleMap}
          editorState={editorState}
          onChange={setEditorState}
          ref={editor}
        />
      </div>
    </div>

    </div>
  );
}