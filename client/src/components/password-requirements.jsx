function checkPasswordRequirements(val) {
  return {
    hasMinLength: val.length >= 8,
    hasUppercase: /[A-Z]/.test(val),
    hasLowercase: /[a-z]/.test(val),
    hasNumber: /[0-9]/.test(val),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(val),
  }
}

export function isPasswordValid(val) {
  const c = checkPasswordRequirements(val)
  return c.hasMinLength && c.hasUppercase && c.hasLowercase && c.hasNumber && c.hasSpecial
}

export function PasswordRequirements({ value, visible }) {
  const reqs = checkPasswordRequirements(value)
  return (
    <div className={`overflow-hidden transition-all duration-200 ${visible ? "max-h-44 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
      <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-3">
        {[
          [reqs.hasMinLength, "At least 8 characters"],
          [reqs.hasUppercase, "One uppercase letter (A-Z)"],
          [reqs.hasLowercase, "One lowercase letter (a-z)"],
          [reqs.hasNumber, "One number (0-9)"],
          [reqs.hasSpecial, "One special character (!@#$%^&*)"],
        ].map(([met, label]) => (
          <p key={label} className="text-xs text-gray-500 mb-1 last:mb-0">
            <span className={met ? "text-white" : "text-red-500"}>{met ? "✓ " : "✗ "}</span>{label}
          </p>
        ))}
      </div>
    </div>
  )
}
