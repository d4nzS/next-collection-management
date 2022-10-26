class InputModel {
  constructor({
                name,
                label,
                type = 'text',
                required = true,
                options,
                enableEditing = true,
                isMarkdown = false
              }) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.required = required;
    this.options = options;
    this.enableEditing = enableEditing;
    this.isMarkdown = isMarkdown;
  }
}

export default InputModel;