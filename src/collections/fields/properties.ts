import { Field } from 'payload'

type PaddingOption =
  | 'NONE'
  | 'SM1'
  | 'SM2'
  | 'SM3'
  | 'MD1'
  | 'MD2'
  | 'MD3'
  | 'LG1'
  | 'LG2'
  | 'LG3'
  | 'XL1'
  | 'XL2'
  | 'XL3'
  | 'XXL1'
  | 'XXL2'
  | 'XXL3'

type BackgroundOption = 'primary' | 'secondary' | 'alt'

type PropertiesDefaults = Partial<{
  paddingTop: PaddingOption
  paddingTopMobile: PaddingOption
  paddingBottom: PaddingOption
  paddingBottomMobile: PaddingOption
  backgroundColor: BackgroundOption
  backgroundColorMobile: BackgroundOption
}>

export const properties = (defaults?: PropertiesDefaults): Field => {
  return {
    name: 'properties',
    type: 'group',
    admin: {
      position: 'sidebar',
    },
    fields: [
      {
        name: 'paddingTop',
        type: 'select',
        options: ['NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3'],
        defaultValue: defaults?.paddingTop || 'NONE',
      },
      {
        name: 'paddingTopMobile',
        type: 'select',
        options: ['NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3'],
        defaultValue: defaults?.paddingTopMobile || 'NONE',
      },
      {
        name: 'paddingBottom',
        type: 'select',
        options: ['NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3'],
        defaultValue: defaults?.paddingBottom || 'NONE',
      },
      {
        name: 'paddingBottomMobile',
        type: 'select',
        options: ['NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3'],
        defaultValue: defaults?.paddingBottomMobile || 'NONE',
      },
      {
        name: 'backgroundColor',
        type: 'select',
        options: ['primary', 'secondary', 'alt'],
        defaultValue: defaults?.backgroundColor || 'primary',
      },
      {
        name: 'backgroundColorMobile',
        type: 'select',
        options: ['primary', 'secondary', 'alt'],
        defaultValue: defaults?.backgroundColorMobile || 'primary',
      },
    ]
  }
}
