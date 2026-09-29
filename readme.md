# gitignore-to-glob-cli

Converts [gitignore patterns](https://git-scm.com/docs/gitignore#_pattern_format) into [minimatch-style globs](https://isaacs.github.io/minimatch/#features).

Supports reading from (and searching for) `.gitignore` files or converting individual patterns directly.

## Install

```sh
npm install --global gitignore-to-glob-cli
```

<details>
<summary>Other Package Managers</summary>
<p>

```sh
yarn global add gitignore-to-glob-cli
```

```sh
pnpm add -g gitignore-to-glob-cli
```

</p>
</details>

## Usage

```sh
$ gitignore-to-glob --help

  Usage
    $ gitignore-to-glob […]

  Options
    --input  -i  Path to .gitignore file

  Examples
    Read from .gitignore, searching up
    $ gitignore-to-glob

    Read from given file
    $ gitignore-to-glob -i path/to/.gitignore

    Convert inputs
    $ gitignore-to-glob "foo" "/*.bar" "baz/"
    **/foo
    /*.bar
    **/baz/**
```

## Related

- [gitignore-to-minimatch](https://github.com/humanwhocodes/gitignore-to-minimatch) - Utility to convert gitignore patterns into minimatch patterns.
