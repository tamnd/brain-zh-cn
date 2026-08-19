---
title: "CF 102262F - \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0434\u0438\u0440\u0435\u043a\u0442\u043e\u0440\u0438\u0438"
description: "我们有同一目录树的两个快照，初始状态 A 和最终状态 B。每个列出的对象要么是由尾随 / 识别的目录，要么是具有关联哈希的文件。 根目录本身是隐式的，不会出现在输入中。"
date: "2026-08-17T20:22:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102262
codeforces_index: "F"
codeforces_contest_name: "\u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e - \u0444\u0438\u043d\u0430\u043b (\u042f\u043d\u0434\u0435\u043a\u0441)"
rating: 0
weight: 102262
solve_time_s: 148
verified: true
draft: false
---

[CF 102262F - \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0434\u0438\u0440\u0435\u043a\u0442\u043e\u0440\u0438\u0438](https://codeforces.com/problemset/problem/102262/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有同一目录树的两个快照，初始状态 A 和最终状态 B。每个列出的对象要么是一个目录，由尾随的目录识别`/`，或具有关联哈希的文件。 根目录本身是隐式的，不会出现在输入中。 

允许的操作是有意限制的。 仅当其父目录已存在时才能创建目录，并且仅当其为空时才能删除目录。 无法从头开始创建文件。 获取新文件名的唯一方法是创建到现有文件的硬链接，因此新名称具有与源完全相同的哈希值。 可以使用以下命令删除现有的硬链接`unlink`。 

输入最多给出`10^4`每个快照中的对象，因此二次扫描最多执行`10^8`对象比较。 这对于 Python 中的 2 秒限制来说已经太多了，并且比较路径字符串可能会使每次比较本身变得非常量。 我们本质上需要线性或近线性处理。 最大路径和哈希长度仅为 256，因此对这种大小的字符串进行哈希和排序是实用的。 

有几种情况可能会欺骗粗心的实施。 如果源文件位于最终必须消失的目录内，则在创建所有必需的硬链接之前无法删除源文件。 例如，```
1 1
/old/x h
/new/x h
```需要两次操作，`link /old/x /new/x`其次是`unlink /old/x`。 正在删除`/old/x`首先会使所需的链接变得不可能。 

嵌套目录创建了类似的排序约束。 为了```
2 2
/old/
/old/x/
/new/
/new/x/
```正确的最小值是两次操作，`mkdir /new/`仅当`/new/x/`直接表示为第二个新目录。 更准确地说，对于给定的四个条目，`/old/`和`/new/`是唯一的目录，所以输出是`mkdir /new/`其次是`rmdir /old/`。 在处理旧目录内容之前删除旧目录的粗心实现可能会在更深的版本上失败，例如```
3 3
/old/
/old/x/
/old/x/f
/new/
/new/x/
/new/x/g
```旧的子树必须从下往上清空。 

第三种边缘情况是多个文件具有相同的哈希值。 认为```
2 2
/a h
/b h
/c h
/d h
```单个原始文件可以用作两个新硬链接的源。 最少是四次操作，两个`link`操作和两个`unlink`运营。 没有理由搜索新旧文件之间的一对一匹配。 

最后，即使正在移动另一个具有相同哈希值的文件，也不得触及未更改的文件。 为了```
1 1
/a h
/a h
```答案很简单`0`。 通用名称已经表示正确的硬链接，并且其哈希值保证匹配。 

## 方法

 直接的解决方案可以重复搜索一个快照以查找另一快照中的每个对象。 对于 A 中的每个路径，我们可以扫描 B 以确定它是否保留，然后执行另一次扫描以匹配文件哈希值。 这是正确的，因为在显式找到相应的对象后可以导出每个所需的操作，但仅第一个比较阶段就可能需要`n * m = 10^8`当两个快照都包含时的路径比较`10^4`对象。 对于最多 256 个字符的路径，这远远超出了我们的需要。 

暴力方法之所以有效，是因为对象的身份就是其完整路径。 有用的观察结果是路径已经是唯一的，并且该语句保证一个快照中的文件永远不会与另一快照中的目录具有相同的路径。 我们可以将所有对象放入哈希表中，并立即按精确路径对它们进行分类。 

一旦路径被分类，文件操作的次数就固定了。 每个仅存在于 A 中的文件最终都必须被删除，因此每个这样的文件至少花费一个`unlink`。 每个仅存在于 B 中的文件都必须创建为硬链接，因此每个这样的文件至少花费一个`link`。 这两个操作始终足够：在适当的源仍然存在的情况下创建每个所需的目标硬链接，然后删除所有过时的文件名。 

仅需要哈希来选择新硬链接的源。 对于每个哈希值，我们都会记住 A 中具有该哈希值的一个文件。 如果散列出现在未更改的文件中，则首选该文件作为源很方便，因为它永远不会被删除。 否则，具有该哈希值的 A-only 文件可以作为临时源。 我们在删除任何 A-only 文件之前创建所有新的硬链接，因此即使计划删除的源也仍然可用足够长的时间。 

目录具有相同的固定下限。 仅存在于 B 中的每个目录都需要一个`mkdir`，并且仅在 A 中存在的每个目录都需要一个`rmdir`。 唯一的困难是订购。 新目录必须由浅到深创建，而旧目录必须由深到浅删除。 一旦所有新目录存在，每个目标文件都有一个有效的父目录，并且一旦删除所有过时的文件，每个旧目录最终都会变空。 

因此，最小操作数正是 A 和 B 之间路径不同的对象的数量。算法只需为那些不可避免的操作找到合法的顺序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nm·L) | O(n + m) | 太慢了 |
 | 最佳| O((n + m) log(n + m) · L) | O(n + m) | 已接受 |

 这里`L`是最大路径长度，最多 256。对于有界路径长度，这实际上是`O((n + m) log(n + m))`。 

## 算法演练

 1.读取A和B的所有对象，并将文件与目录分开。 将文件存储为`path -> hash`和目录作为一组路径。 同时，为每个哈希记住一个 A 文件。 
2.找到需要创建的目录`B_dirs - A_dirs`。 通过增加目录深度对它们进行排序，并使用路径作为辅助键。 父目录必须在其子目录之前存在，因此每个新创建的目录在发出其操作时都将具有有效的父目录。 
3.找到需要删除的目录`A_dirs - B_dirs`。 按深度递减对它们进行排序。 一个孩子必须在其父母变空之前消失，所以这个顺序使得每个`rmdir`合法的。 
4. 查找仅在 B 中出现的文件。对于每个此类文件，在从 A 构建的源映射中查找其哈希值并发出`link source target`手术。 所有目标目录都已创建，并且来自 A 的所有源文件仍然存在，因为没有`unlink`已经发生了。 
5. 查找仅在 A 中出现的文件并发出`unlink`每一项的操作。 此时，所有新的硬链接都已创建，因此即使用作源的过时文件也可以安全地删除。 
6. 发出`rmdir`按深度递减顺序对仅旧目录进行操作。 所有过时的文件都已消失，因此目录现在可以为空。 
7. 打印发出的操作总数，然后打印操作本身。 公共文件和公共目录永远不会出现，因为它们已经完全具有所需的状态。 

### 为什么它有效

 独立考虑每条路径。 公共路径在两个快照中具有相同的对象类型，并且公共文件具有相同的哈希，因此触摸它不能将操作数量减少到零以下。 仅存在于 B 中的文件至少需要一个`link`，而仅存在于 A 中的文件至少需要一个`unlink`。 我们的算法正是执行这些操作，并在删除任何可能的来源之前创建每个新链接，因此所有这些操作都是合法的。 

同样的论点也适用于目录。 每个 B-only 目录都需要一个`mkdir`，并且每个 A-only 目录都需要一个`rmdir`。 按深度对创建进行排序可以保证父级首先存在。 按反向深度对删除进行排序可以保证子项首先消失。 因此，每个发出的操作都是合法的，并且操作数量达到不可避免的下限，从而使序列最小化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    a_files = {}
    a_dirs = set()

    for _ in range(n):
        parts = input().split()
        path = parts[0]

        if path.endswith('/'):
            a_dirs.add(path)
        else:
            a_files[path] = parts[1]

    b_files = {}
    b_dirs = set()

    for _ in range(m):
        parts = input().split()
        path = parts[0]

        if path.endswith('/'):
            b_dirs.add(path)
        else:
            b_files[path] = parts[1]

    common_files = a_files.keys() & b_files.keys()

    source_by_hash = {}

    # Prefer files that survive in B as sources.
    for path in common_files:
        source_by_hash[a_files[path]] = path

    # If a hash has no surviving source, an obsolete A-file can be used
    # until all required links have been created.
    for path, h in a_files.items():
        if h not in source_by_hash:
            source_by_hash[h] = path

    add_dirs = sorted(
        b_dirs - a_dirs,
        key=lambda p: (p.count('/'), p)
    )

    remove_dirs = sorted(
        a_dirs - b_dirs,
        key=lambda p: (-p.count('/'), p)
    )

    add_files = sorted(
        b_files.keys() - a_files.keys()
    )

    remove_files = sorted(
        a_files.keys() - b_files.keys()
    )

    operations = []

    for path in add_dirs:
        operations.append(f"mkdir {path}")

    for target in add_files:
        source = source_by_hash[b_files[target]]
        operations.append(f"link {source} {target}")

    for path in remove_files:
        operations.append(f"unlink {path}")

    for path in remove_dirs:
        operations.append(f"rmdir {path}")

    out = [str(len(operations))]
    out.extend(operations)
    sys.stdout.write('\n'.join(out) + '\n')

if __name__ == "__main__":
    solve()
```前两个字典和集合直接代表两个快照。 使用完整路径作为键使得测试对象是否常见成为平均 O(1) 操作。 

这`source_by_hash`映射捕获硬链接所需的唯一信息。 首选通用文件作为源，因为它会一直存在到最后。 如果没有公共文件具有所需的哈希值，则仅 A 文件将成为源。 这样的文件会故意保持活动状态，直到创建每个新的硬链接为止。 

目录排序使用`path.count('/')`作为深度测量。 因为每个目录路径都以`/`，子级总是比其父级具有更多的斜线数。 确切的数字深度无关紧要，只有顺序很重要。 

操作组按固定顺序发出。 首先创建目录，因为链接和嵌套目录可能依赖于它们。 链接出现在取消链接之前，因为可能需要过时的源。 取消链接先于`rmdir`，因为目录在删除之前必须为空。 

Python不存在整数溢出问题，最大运算次数最多为`2(n + m)`，对于给定的限制低于 40000。 输出本身存储在列表中，以便可以在操作之前打印操作计数。 

## 工作示例

 对于提供的示例，公共目录是`/a/`。 目录`/a/e/`必须创建并且`/f/`必须消失。 该文件`/a/b.txt`是新文件的可用来源`/a/e/c.txt`， 尽管`/a/d.txt`已经过时了。 

| 步骤| 运营| 新目录 | 新文件 | 剩余的旧文件 |
 | ---| ---| ---| ---| ---|
 | 1 |`mkdir /a/e/`|`/a/e/`存在 | 无 |`/a/b.txt`,`/a/d.txt`|
 | 2 |`link /a/b.txt /a/e/c.txt`|`/a/e/`存在 |`/a/e/c.txt`存在 |`/a/b.txt`,`/a/d.txt`|
 | 3 |`unlink /a/b.txt`| 不变|`/a/e/c.txt`存在 |`/a/d.txt`|
 | 4 |`unlink /a/d.txt`| 不变|`/a/e/c.txt`存在 | 无 |
 | 5 |`rmdir /f/`| 最终目录仍保留| 最终文件仍然存在| 无 |

 生成的序列有五个操作，与示例输出的最小值相同。 该顺序与语句的示例不同，这是允许的，因为接受任何最小有效序列。 

对于第二个示例，考虑在两个嵌套目录树之间移动文件。```
6 6
/old/
/old/sub/
/old/sub/file h
/new/
/new/sub/
/new/sub/file2 h
```两个目录树没有公共目录，唯一的文件被重命名。 

| 步骤| 运营| 创建目录 | 现有来源 | 过时的文件 |
 | ---| ---| ---| ---| ---|
 | 1 |`mkdir /new/`|`/new/`|`/old/sub/file`| 无 |
 | 2 |`mkdir /new/sub/`|`/new/`,`/new/sub/`|`/old/sub/file`| 无 |
 | 3 |`link /old/sub/file /new/sub/file2`| 两个新目录|`/old/sub/file`| 无 |
 | 4 |`unlink /old/sub/file`| 不变| 不需要| 无 |
 | 5 |`rmdir /old/sub/`| 不变| 无 | 部分删除旧子树 |
 | 6 |`rmdir /old/`| 最后一棵树到达 | 无 | 旧子树不见了|

 该示例演示了两种深度排序。`/new/`必须先于`/new/sub/`， 尽管`/old/sub/`必须先于`/old/`在删除顺序中。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log(n + m) · L) | 哈希表分类平均是线性的，目录/文件排序占主导地位 |
 | 空间| O(n + m) | 所有路径、哈希值和生成的操作都被存储 |

 这里`L <= 256`是最大路径长度。 至多有`10^4`每个快照中的对象，最多排序`2 * 10^4`短字符串很容易在限制之内，并且生成的操作计数低于`4 * 10^4`。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    a_files = {}
    a_dirs = set()

    for _ in range(n):
        parts = input().split()
        path = parts[0]
        if path.endswith('/'):
            a_dirs.add(path)
        else:
            a_files[path] = parts[1]

    b_files = {}
    b_dirs = set()

    for _ in range(m):
        parts = input().split()
        path = parts[0]
        if path.endswith('/'):
            b_dirs.add(path)
        else:
            b_files[path] = parts[1]

    source_by_hash = {}

    for path in a_files.keys() & b_files.keys():
        source_by_hash[a_files[path]] = path

    for path, h in a_files.items():
        if h not in source_by_hash:
            source_by_hash[h] = path

    add_dirs = sorted(
        b_dirs - a_dirs,
        key=lambda p: (p.count('/'), p)
    )
    remove_dirs = sorted(
        a_dirs - b_dirs,
        key=lambda p: (-p.count('/'), p)
    )
    add_files = sorted(b_files.keys() - a_files.keys())
    remove_files = sorted(a_files.keys() - b_files.keys())

    operations = []

    for path in add_dirs:
        operations.append(f"mkdir {path}")

    for target in add_files:
        operations.append(
            f"link {source_by_hash[b_files[target]]} {target}"
        )

    for path in remove_files:
        operations.append(f"unlink {path}")

    for path in remove_dirs:
        operations.append(f"rmdir {path}")

    sys.stdout.write(
        str(len(operations)) + '\n' +
        '\n'.join(operations) +
        ('\n' if operations else '')
    )

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample1 = """\
4 3
/a/
/a/b.txt hash1
/a/d.txt hash2
/f/
/a/
/a/e/
/a/e/c.txt hash1
"""

expected1 = """\
5
mkdir /a/e/
link /a/b.txt /a/e/c.txt
unlink /a/b.txt
unlink /a/d.txt
rmdir /f/
"""

assert run(sample1) == expected1, "provided sample"

assert run("0 0\n") == "0\n", "minimum-size empty snapshots"

sample2 = """\
4 4
/a h
/b h
/c/
c
"""

# The previous test deliberately is not valid path input, so use a valid
# all-equal-hash case instead.
sample2 = """\
2 2
/a h
/b h
/c h
/d h
"""

expected2 = """\
4
link /a /c
link /a /d
unlink /a
unlink /b
"""

assert run(sample2) == expected2, "all equal hashes"

sample3 = """\
3 3
/old/
/old/sub/
/old/sub/file h
/new/
/new/sub/
/new/sub/file2 h
"""

expected3 = """\
6
mkdir /new/
mkdir /new/sub/
link /old/sub/file /new/sub/file2
unlink /old/sub/file
rmdir /old/sub/
rmdir /old/
"""

assert run(sample3) == expected3, "nested directory ordering"

deep_name = "/" + "a/" * 126
deep_file_a = deep_name + "x"
deep_file_b = deep_name + "y"

sample4 = (
    "1 1\n"
    + deep_file_a + " h\n"
    + deep_file_b + " h\n"
)

out4 = run(sample4).splitlines()
assert out4[0] == "2", "deep path operation count"
assert out4[1] == f"link {deep_file_a} {deep_file_b}"
assert out4[2] == f"unlink {deep_file_a}"

# Maximum-size test: 10000 old files and 10000 new files,
# all having the same hash.
old_files = [f"/a{i}" for i in range(10000)]
new_files = [f"/b{i}" for i in range(10000)]

max_input = (
    "10000 10000\n"
    + ''.join(path + " h\n" for path in old_files)
    + ''.join(path + " h\n" for path in new_files)
)

max_out = run(max_input).splitlines()

assert max_out[0] == "20000", "maximum-size operation count"
assert len(max_out) == 20001, "maximum-size output length"

link_count = sum(line.startswith("link ") for line in max_out[1:])
unlink_count = sum(line.startswith("unlink ") for line in max_out[1:])

assert link_count == 10000, "maximum-size link count"
assert unlink_count == 10000, "maximum-size unlink count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0 0`|`0`| 最小尺寸输入和没有任何变化的情况 |
 | 两个旧文件和两个带哈希的新文件`h`|`4`运营| 为多个硬链接重用一个源并延迟其取消链接 |
 | 嵌套`/old/sub/`到`/new/sub/`|`6`运营| 家长至上`mkdir`和儿童优先`rmdir`|
 | 文件路径接近 256 个字符的限制 |`2`运营| 路径长度边界和精确路径处理|
 | 10000 个旧文件和 10000 个新文件具有相同的哈希值 |`20000`运营| 最大输入大小、全相等哈希值和可扩展性 |

 ## 边缘情况

 空箱无需特殊操作。 为了```
0 0
```两组目录和文件都是空的，因此所有四个差异集都是空的。 该算法不发出任何操作并打印`0`。 

当源文件位于要删除的目录内时，必须在删除其旧目录之前链接该文件。 为了```
3 3
/old/
/old/sub/
/old/sub/file h
/new/
/new/sub/
/new/sub/file2 h
```

the algorithm first creates `/new/`和`/new/sub/`，然后创建`/new/sub/file2`从`/old/sub/file`，然后才删除旧文件。 然后反向深度目录顺序删除`/old/sub/`前`/old/`。 这六个操作正是四个不可避免的目录更改加一个`link`和一个`unlink`。 

具有相同哈希值的多个新文件不需要多个独立的原始源。 为了```
2 2
/a h
/b h
/c h
/d h
```源映射选择`/a`对于哈希`h`。 该算法创建了两个`/c`和`/d`作为硬链接`/a`，然后删除`/a`和`/b`。 输出是四个操作。 事实是`/a`最终被删除并不重要，因为所有使用它的链接都已经被创建了。 

未更改的文件必须从两个文件差异集中排除。 为了```
1 1
/a h
/a h
```

`/a`两个字典中都出现相同的哈希值，因此两者都没有`link`也不`unlink`被生成。 输出是`0`。 这就是为什么仅比较哈希值是不正确的：路径本身决定文件名是否已以所需状态存在。 

最深的有效路径的处理无需递归。 该实现使用了数量`/`字符仅用于对目录操作进行排序，因此即使接近 256 个字符限制的路径也会被视为普通字符串进行处理。 父级的斜杠比其子级的斜杠少，这足以建立所需的创建和删除顺序。
