import {memo} from 'react';
import Downshift from 'downshift';
import './down.css';
import {IoIosArrowDown } from "react-icons/io";
import {IoIosArrowUp} from "react-icons/io";

const SelectInput=({items,onChange,
  value,defValue,validation,disabled})=>{
    
    
  return(
    <Downshift  
                onChange={(selection) =>{onChange(selection.id)}}
                itemToString={(item) => (item ? item.value : "")}
    >
    {({
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    isOpen,
    highlightedIndex}) => (
        <div >
          <button  style={{padding:'4.875px 9.75px',lineHeight:'1'}}
              disabled={disabled && disabled}
                className={`form-control  text-left selectInput ${validation && validation.status}`}
                type="button" 
                {...getToggleButtonProps({onBlur: e => e.preventDefault()})}>
                  <div className='w-100' style={{display:'flex',alignItems:'center'}}>
                    <div className='w-100' style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{value?items.find((item)=>item.id===value).value:defValue}</div>
                    {
                      isOpen?
                      <div><IoIosArrowUp style={{height:'1.28em',width:'1.28em',verticalAlign:'text-bottom'}}/></div>
                      :
                      <div><IoIosArrowDown style={{height:'1.28em',width:'1.28em',verticalAlign:'text-bottom'}}/></div>
                    }
                  </div>
                  
          </button>
          <div className="invalid-feedback mt-0" style={{ position: 'absolute' }}>
               {validation && validation.message}
          </div>

          {isOpen &&
            <div className='downs border-0' style={{position:'relative'}}>
              <ul className='down list-group bg-white border-0 scroll-primary'  {...getMenuProps()} style={{display:'block',overflow:'auto',position:'absolute'}}>
                 {items.map((item, index) => (
                      <li className='form-contol form-control-sm rounded-0 ' 
                      style={
                        item.id===value?
                        {textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #fff',fontWeight:'bold',background:'rgb(228, 244, 228)'}
                        :
                        highlightedIndex === index
                          ? { textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',backgroundColor: 'rgb(231, 238, 236)',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #fff'}
                          : 
                          index===0
                          ? {textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #ced4da'}
                          : {textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #fff'}
                      }
                        {...getItemProps({
                          key: item.id,
                          index,
                          item,
                        })}
                      >
                        {item.count?
                          <ul style={{display:'flex',justifyContent:'space-between'}}>
                            <li>{item.value}</li>
                            <li style={{background:'#ff000094',padding:'0px 3px',borderRadius:'4px',color:'white',fontWeight:'bold'}}>{item.count}</li>
                          </ul>
                        :
                          item.value}
                      </li>
                    ))}
            </ul>
            </div>
          }
        </div>
      )}
    </Downshift>
  )
}

export default memo(SelectInput);