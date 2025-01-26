import { render, screen, fireEvent } from '@testing-library/react'
import { RageClickButton } from '../RageClickButton'

describe('RageClickButton', () => {
  it('renders the button', () => {
    render(<RageClickButton />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('displays the correct text', () => {
    render(<RageClickButton />)
    expect(screen.getByText('This Button Does Nothing')).toBeInTheDocument()
  })

  it('displays the rage click instruction', () => {
    render(<RageClickButton />)
    expect(screen.getByText(/Try clicking this button repeatedly/i)).toBeInTheDocument()
  })
})
