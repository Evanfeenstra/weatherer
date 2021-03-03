
import React from 'react'

const context = React.createContext()

export default context

export const initialState = {
    weather:null,
    loading:false,
    error:'',
    text:'Portland',
}