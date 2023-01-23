type Props = {
    checked?: boolean
}

/**
 * The Checkbox component simply renders a box without, or with a background
 * color, based on its checked prop.
 * 
 * @param Props The component props
 * @returns JSX.Element
 */
export const CheckBoxComponent = ({ checked = false }: Props) => <span className={`w-4 h-4 shrink-0 inline-block mr-2 mt-1 border-2 border-indigo-600 rounded transition-colors ${checked ? 'bg-indigo-600' : ''}`} data-testid="checkbox"></span>