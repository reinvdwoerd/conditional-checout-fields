import React from 'react'
import InlineSVG from 'svg-inline-react'
import {title, snakeCase} from 'change-case'
import FieldToggle from './FieldToggle'

export default function Field ({name, type, required, showOnEmails, updateField, removeField, i, editSelect})
{
    return (
        <div className='field'>
            <input
                placeholder="Field"
                value={title(name)}
                onChange={e => updateField(i, 'name', snakeCase(e.target.value))}
            />

            <div className="middle">
                <select className="type" value={type} onChange={e => updateField(i, 'type', e.target.value)}>
                    <option value="text">Input</option>
                    <option value="textarea">Textarea</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="select">Select</option>
                </select>
                <button onClick={_ => editSelect(i)} className={type == 'select' ? 'edit show' : 'edit hidden'}>
                    edit
                </button>
            </div>


            <div className="right">
                <FieldToggle updateField={updateField} name='showOnEmails' enabled={showOnEmails} i={i}/>
                <FieldToggle updateField={updateField} name='required' enabled={required} i={i}/>
            </div>

            <button className="remove" onClick={_ => removeField(i)}>
                <InlineSVG src={require('../public/remove.svg')}/>
            </button>

        </div>
    )
}
