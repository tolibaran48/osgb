import {useState,memo} from 'react';
import Downshift from 'downshift';
import './down.css';
import {IoIosArrowDown } from "react-icons/io";
import {IoIosArrowUp} from "react-icons/io";

const SearchInput=({items,onChange,reset,
  value,defValue,validation,disabled})=>{
    const [inputValue,setInputValue]=useState('');
    
  return(
   <div>
    <Downshift  inputValue={inputValue} 
                onChange={(selection) =>{onChange(selection.id);setInputValue('')}}
                itemToString={(item) => (item ? item.value : '')}
    >

    {({
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    isOpen,
    highlightedIndex,
    getRootProps}) => (
        <div style={{position:'relative'}}>
          <button 
                disabled={disabled && disabled}
                className={`form-control text-left searchInput ${validation && validation.status}`}
                type="button" 
                {...getToggleButtonProps({onBlur: e => e.preventDefault()})}>
                  <div className='w-100' style={{display:'flex'}}>
                    <div className='w-100' style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{value?items.find((item)=>item.id===value).value:defValue}</div>
                    {
                      isOpen?
                      <div><IoIosArrowUp style={{height:'1.28em',width:'1.28em',verticalAlign:'text-bottom'}}/></div>
                      :
                      <div><IoIosArrowDown style={{height:'1.28em',width:'1.28em',verticalAlign:'text-bottom'}}/></div>
                    }
                  </div>
                  
          </button>          
          <div className="invalid-feedback mt-0">
            {validation?validation.message:null}
          </div>

          {isOpen &&
            <div className='downs'>
              <div className='pl-5 pr-5 m-0' style={{display:'flex'}}><input type='search' className='form-control form-control-sm' placeholder='Ara...' {...getInputProps({onChange:(e)=>setInputValue(e.target.value)})} style={{width:'100%',marginBottom:'0.3rem',marginTop:'0.3rem',background:'#eaf4fd4f'}}  autoFocus />{reset && (<button style={{marginLeft:'5px',width:'10px',marginBottom:'0.3rem',marginTop:'0.3rem',display:'flex',justifyContent:'center'}} type='button' className='form-control form-control-sm' onClick={reset}>X</button>)}</div>
              
              <ul className='down list-group scroll-primary'  {...getMenuProps()} style={{paddingLeft:'0.5rem',paddingRight:'0.5rem',paddingBottom:'0.3rem',display:'block'}} >              
                 {items
                     .filter((item) => item.value.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()))
                    .map((item, index) => (
                      <li className='form-contol form-control-sm rounded-0 ' 
                      style={
                        highlightedIndex === index
                          ? { overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',backgroundColor: '#bde4ff',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #fff'}
                          : 
                          index===0
                          ? {overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #ced4da'}
                          : {overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',borderLeft:'1px solid  #ced4da',borderRight:'1px solid  #ced4da',borderBottom:'1px solid  #ced4da',borderTop:'1px solid  #fff'}
                      }
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                        })}
                      >
                        {item.value}
                      </li>
                    ))}
            </ul>
            </div>
          }
        </div>
      )}
    </Downshift>
  </div>
  )
}

export default memo(SearchInput);