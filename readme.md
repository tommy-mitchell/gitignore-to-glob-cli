# gitignore-to-minimatch-cli

Wrapper for [`@humanwhocodes/gitignore-to-minimatch`](https://github.com/humanwhocodes/gitignore-to-minimatch) package.

## Install

```sh
npm install --global gitignore-to-minimatch-cli
```

<details>
<summary>Other Package Managers</summary>
<p>

```sh
yarn global add gitignore-to-minimatch-cli
```

```sh
pnpm add -g gitignore-to-minimatch-cli
```

</p>
</details>

## Usage

```sh
$ gitignore-to-minimatch --help

  Usage
    $ gitignore-to-minimatch […]

  Options
    --input  -i  Path to .gitignore file

  Examples
    Read from .gitignore, searching up
    $ gitignore-to-minimatch

    Read from given file
    $ gitignore-to-minimatch -i path/to/.gitignore

    Convert inputs
    $ gitignore-to-minimatch "foo" "/*.bar" "baz/"
    **/foo
    /*.bar
    **/baz/**
```
