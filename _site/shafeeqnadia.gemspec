# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll_theme"
  spec.version       = "1.2"
  spec.authors       = ["Satuhearty"]
  spec.email         = ["satuhearty@gmail.com"]

  spec.summary       = %q{A Jekyll version of the "Dimension" theme by HTML5 UP.}
  spec.homepage      = "https://satuhearty.github.io/shafeeqnadia"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_development_dependency "jekyll", "~> 3.3"
  spec.add_development_dependency "bundler", "~> 1.12"
end
