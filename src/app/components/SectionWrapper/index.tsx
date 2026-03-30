import { ContainerPropsType } from '@types-frontend/types'
import clsx from 'clsx'

export interface SectionWrapperProps {
  className?: string
  sectionClassName?: string
  containerProps: ContainerPropsType
}

export const SectionWrapper = ({
  children,
  className,
  sectionClassName,
  containerProps,
}: React.PropsWithChildren<SectionWrapperProps>) => {
  return (
    <div
      className={clsx(sectionClassName, {
        'pt-0': containerProps?.paddingTopMobile === 'NONE',
        'pt-0.5': containerProps?.paddingTopMobile === 'SM1',
        'pb-0': containerProps?.paddingBottomMobile === 'NONE',
        'pb-0.5': containerProps?.paddingBottomMobile === 'SM1',
        'pt-1': containerProps?.paddingTopMobile === 'SM2',
        'pb-1': containerProps?.paddingBottomMobile === 'SM2',
        'pt-2': containerProps?.paddingTopMobile === 'SM3',
        'pb-2': containerProps?.paddingBottomMobile === 'SM3',
        'pt-4': containerProps?.paddingTopMobile === 'MD1',
        'pb-4': containerProps?.paddingBottomMobile === 'MD1',
        'pt-5': containerProps?.paddingTopMobile === 'MD2',
        'pb-5': containerProps?.paddingBottomMobile === 'MD2',
        'pt-6': containerProps?.paddingTopMobile === 'MD3',
        'pb-6': containerProps?.paddingBottomMobile === 'MD3',
        'pt-8': containerProps?.paddingTopMobile === 'LG1',
        'pb-8': containerProps?.paddingBottomMobile === 'LG1',
        'pt-10': containerProps?.paddingTopMobile === 'LG2',
        'pb-10': containerProps?.paddingBottomMobile === 'LG2',
        'pt-12': containerProps?.paddingTopMobile === 'LG3',
        'pb-12': containerProps?.paddingBottomMobile === 'LG3',
        'pt-14': containerProps?.paddingTopMobile === 'XL1',
        'pb-14': containerProps?.paddingBottomMobile === 'XL1',
        'pt-xl2': containerProps?.paddingTopMobile === 'XL2',
        'pb-xl2': containerProps?.paddingBottomMobile === 'XL2',
        'pt-xl3': containerProps?.paddingTopMobile === 'XL3',
        'pb-xl3': containerProps?.paddingBottomMobile === 'XL3',
        'pt-20': containerProps?.paddingTopMobile === 'XXL1',
        'pb-20': containerProps?.paddingBottomMobile === 'XXL1',
        'pt-24': containerProps?.paddingTopMobile === 'XXL2',
        'pb-24': containerProps?.paddingBottomMobile === 'XXL2',
        'pt-xxl3': containerProps?.paddingTopMobile === 'XXL3',
        'pb-xxl3': containerProps?.paddingBottomMobile === 'XXL3',
        'lg:pt-0': containerProps?.paddingTop === 'NONE',
        'lg:pt-0.5': containerProps?.paddingTop === 'SM1',
        'lg:pb-0': containerProps?.paddingBottom === 'NONE',
        'lg:pb-0.5': containerProps?.paddingBottom === 'SM1',
        'lg:pt-1': containerProps?.paddingTop === 'SM2',
        'lg:pb-1': containerProps?.paddingBottom === 'SM2',
        'lg:pt-2': containerProps?.paddingTop === 'SM3',
        'lg:pb-2': containerProps?.paddingBottom === 'SM3',
        'lg:pt-4': containerProps?.paddingTop === 'MD1',
        'lg:pb-4': containerProps?.paddingBottom === 'MD1',
        'lg:pt-5': containerProps?.paddingTop === 'MD2',
        'lg:pb-5': containerProps?.paddingBottom === 'MD2',
        'lg:pt-6': containerProps?.paddingTop === 'MD3',
        'lg:pb-6': containerProps?.paddingBottom === 'MD3',
        'lg:pt-8': containerProps?.paddingTop === 'LG1',
        'lg:pb-8': containerProps?.paddingBottom === 'LG1',
        'lg:pt-10': containerProps?.paddingTop === 'LG2',
        'lg:pb-10': containerProps?.paddingBottom === 'LG2',
        'lg:pt-12': containerProps?.paddingTop === 'LG3',
        'lg:pb-12': containerProps?.paddingBottom === 'LG3',
        'lg:pt-14': containerProps?.paddingTop === 'XL1',
        'lg:pb-14': containerProps?.paddingBottom === 'XL1',
        'lg:pt-xl2': containerProps?.paddingTop === 'XL2',
        'lg:pb-xl2': containerProps?.paddingBottom === 'XL2',
        'lg:pt-xl3': containerProps?.paddingTop === 'XL3',
        'lg:pb-xl3': containerProps?.paddingBottom === 'XL3',
        'lg:pt-20': containerProps?.paddingTop === 'XXL1',
        'lg:pb-20': containerProps?.paddingBottom === 'XXL1',
        'lg:pt-24': containerProps?.paddingTop === 'XXL2',
        'lg:pb-24': containerProps?.paddingBottom === 'XXL2',
        'lg:pt-xxl3': containerProps?.paddingTop === 'XXL3',
        'lg:pb-xxl3': containerProps?.paddingBottom === 'XXL3',
        'bg-background-primary': containerProps?.backgroundColorMobile === 'primary',
        'bg-background-secondary': containerProps?.backgroundColorMobile === 'secondary',
        'bg-background-alt': containerProps?.backgroundColorMobile === 'alt',
        'lg:bg-background-primary': containerProps?.backgroundColor === 'primary',
        'lg:bg-background-secondary': containerProps?.backgroundColor === 'secondary',
        'lg:bg-background-alt': containerProps?.backgroundColor === 'alt',
      })}
    >
      <div className={clsx('lg:px-xl3 mx-auto w-full px-4 lg:max-w-360', className)}>
        {children}
      </div>
    </div>
  )
}
