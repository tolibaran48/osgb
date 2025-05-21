import React, { useState, useRef,useEffect } from 'react';
import { EditorState, RichUtils, convertFromRaw ,convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.scss";
//import "draft-js/dist/Draft.css";

function MyEditor({ onBlurs,value }) {
  const [editorState, setEditorState] = useState();
  const editor = useRef(null);

  useEffect(() => {
    if(value){
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(value??null))));
    }
    else{
      setEditorState(EditorState.createEmpty());
    }
}, [])



  const toolbar={
    options: ['inline','fontSize','colorPicker','textAlign', 'list'],
    inline: { className: 'list',options: ['bold', 'italic', 'underline']},
    list:{ className: 'list',options:['unordered','ordered']},
    textAlign:{ className: 'list',options:['left','center','right']},
    fontSize: {
      options: ['8pt', '9pt', '10pt', '11pt', '12pt', '13pt'],
      className: undefined,
      component: undefined,
      dropdownClassName: 'list',
    },
    colorPicker: {
      className: 'list',
      component: undefined,
      popupClassName: undefined,
      colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
        'rgb(147,101,184)','rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',],
    },
  }


  return (
   

        <Editor
          toolbarOnFocus
          editorState={editorState}
          toolbarClassName="popup"
          wrapperClassName="wrapperOSGB"
          editorClassName="editor"
          onEditorStateChange={setEditorState}
          toolbar={toolbar}
        //customStyleMap={styleMap}
        //editorState={editorState}
        //={setEditorState}
        // ref={editor}
         onBlur={()=>onBlurs(editorState)}
        />
  );
}

export default MyEditor;

//const toggleInlineStyle = (event) => {
// event.preventDefault();
//let style = event.currentTarget.getAttribute('data-style');
//setEditorState(RichUtils.toggleInlineStyle(editorState, style));
// }

//const renderInlineStyleButton = ( value, style) => {
//const currentBlockType = RichUtils.getCurrentBlockType(editorState);
//let className = '';
//if (currentBlockType) {
//className = 'active';
//}
//if (type!=='select'){
//return (
//<input
//type="button"
//key={style}
// value={value}
// className={className}
//data-style={style}
// onMouseDown={toggleInlineStyle}
//>
//);
//}
// }


//<div className="inline-style-options">
// Inline Styles:
// {inlineStyleButtons.map((button) => {
//   return renderInlineStyleButton(button.value, button.style);
// })}
//</div>