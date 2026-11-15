---
title: "CF 72B - INI 文件"
description: "我们得到一个以 INI 格式编写的文本文件。 每个有意义的行要么是节声明（例如 [network]），要么是键值分配（例如 port=8080）。 键、值和节括号周围的空格无关紧要，必须在最终输出中删除。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation"]
categories: ["algorithms"]
codeforces_contest: 72
codeforces_index: "B"
codeforces_contest_name: "Unknown Language Round 2"
rating: 2200
weight: 72
solve_time_s: 105
verified: true
draft: false
---

[CF 72B - INI 文件](https://codeforces.com/problemset/problem/72/B)

 **评分：** 2200
 **标签：** *特殊、实施
 **求解时间：** 1m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个以 INI 格式编写的文本文件。 每个有意义的行都是一个节声明，例如`[network]`或键值分配，例如`port=8080`。 键、值和节括号周围的空格无关紧要，必须在最终输出中删除。 第一个非空格字符为的行`;`是评论，应该完全忽略。 

该文件的行为类似于一系列更新。 如果尚未声明任何节，则键属于当前节或全局范围。 如果相同的键在同一部分中出现多次，则只有最后一次出现的键会保留下来。 不同的部分是独立的，因此相同的键名可能存在于多个部分中。 

输出必须通过三种方式标准化。 全局键是第一位的。 随后按字典顺序打印各部分。 在每个范围内，键也按字典顺序打印。 空行、注释和多余的空格完全消失。 

与大多数竞争性编程问题相比，这些限制很小。 最多 510 行，总输入大小只有 10000 个字符。 即使相对低效的解析策略也能轻松通过。 主要挑战不是性能，而是正确再现覆盖、空白修剪和节处理的确切语义。 

一些边缘情况可能会悄无声息地破坏粗心的实现。 

一个部分可能会在文件中出现多次。 属于该部分的所有键必须合并在一起。 

输入：```
4
[a]
x=1
[a]
y=2
```正确输出：```
[a]
x=1
y=2
```每次都会创建一个新的节对象的简单实现`[a]`似乎会错误地打印两个单独的部分。 

键必须覆盖同一部分中较早的值。 

输入：```
4
[a]
x=1
x=7
y=2
```正确输出：```
[a]
x=7
y=2
```如果我们简单地将作业附加到列表中，则两者`x`线路将保留。 

空白处理也很微妙。 

输入：```
3
  a   =   5
[b]
   c =  7
```正确输出：```
a=5
[b]
c=7
```如果没有仔细去除两侧的空间`=`，输出格式无效。 

注释检测取决于第一个非空格字符。 

输入：```
2
   ;hello
x=1
```正确输出：```
x=1
```仅检查`line[0] == ';'`会失败，因为分号实际上并不是第一个字符。 

## 方法

 最直接的解决方案是完全按照写入方式模拟文件。 我们扫描每一行，维护当前部分，并将键值对存储在与该部分关联的结构中。 每当我们遇到重复的键时，我们就会覆盖旧值。 解析完成后，我们在打印之前对部分和键进行排序。 

真正的强力实现可以将每个分配存储在列表中，并在输出期间向后扫描以查找每个键的最后一个值。 如果有`m`作业，这可能需要重复检查几乎所有早期作业。 在最坏的情况下，这会变成`O(m^2)`运营。 

这种方法在这里仍然通过，因为输入很小，但它不必要地复杂且容易出错。 问题的结构给了我们一个更清晰的观察：只有每个的最新值`(section, key)`配对很重要。 在出现后来的覆盖之后，早期的分配立即变得无关紧要。 

这种观察自然会产生哈希图。 我们每个部分维护一本字典。 分配一个键就变成了：```
sections[current][key] = value
```任何先前的值都会被自动替换。 解析完成后，我们只需要按字典顺序排序即可输出格式。 

解析本身主要是实现工作。 我们必须区分注释、节标题和作业，同时正确修剪空格。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(平方米) | O(米) | 已接受但没有必要 |
 | 最佳| O(m log m) | O(米) | 已接受 |

 这里，`m`是不同存储键的数量加上排序开销。 

## 算法演练

 1. 创建一个全局键字典和另一个将节名称映射到其自己的字典的字典。 
2. 将当前节初始化为全局范围。 我们可以用空字符串来表示它。 
3. 读取每一行并仅删除结尾的换行符。 
4. 删除整行的前导和尾随空格。 这简化了后续检查。 
5. 如果修剪后该行为空，请忽略它。 声明称，多余的线路应该消失。 
6. 如果第一个字符是`;`，忽略该行，因为它是注释。 
7. 如果该行代表节标题，则提取节名称。 

剖面线开始于`[`并以`]`修剪空格后。 我们删除括号并再次修剪内部，因为括号周围的空格无关紧要。 
8. 如果此部分以前没有出现过，请为其创建一个空字典。 
9. 将当前部分更新为此部分名称。 
10. 否则，该行必须是键值分配。 首先分割字符串`=`特点。 

仅拆分一次很重要，因为值本身可能包含应保持不变的符号。 
11. 分别修剪键和值周围的空格。 
12. 将作业存储到当前部分的字典中。 

如果该键已存在，则新值会自动覆盖旧值。 
13. 处理完所有行后，首先按排序顺序打印全局键。 
14. 然后按字典顺序打印所有部分。 对于每个部分，按排序顺序打印其键。 

### 为什么它有效

 在解析过程中的每个时刻，每个字典都准确存储该范围内每个键所看到的最新值。 当出现重复赋值时，替换存储的值符合仅最后一次出现的问题要求。 

各部分是独立的，因为每个部分都有自己的字典。 同一部分的重复出现会继续修改同一字典，从而正确合并整个文件中分散的定义。 

无论原始输入顺序如何，最终的排序步骤都保证字典顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    sections = {"": {}}
    current = ""

    for _ in range(n):
        line = input().rstrip("\n").strip()

        if not line:
            continue

        if line[0] == ';':
            continue

        if line[0] == '[' and line[-1] == ']':
            section = line[1:-1].strip()

            if section not in sections:
                sections[section] = {}

            current = section
        else:
            key, value = line.split("=", 1)

            key = key.strip()
            value = value.strip()

            sections[current][key] = value

    global_keys = sections[""]

    for key in sorted(global_keys):
        print(f"{key}={global_keys[key]}")

    for section in sorted(s for s in sections if s != ""):
        print(f"[{section}]")

        for key in sorted(sections[section]):
            print(f"{key}={sections[section][key]}")

if __name__ == "__main__":
    solve()
```该解决方案将每个范围保存在字典中。 空字符串代表全局范围，因为第一部分之前的键不属于其他地方。 

解析逻辑从修剪整行开始。 这很重要，因为注释可能在前导空格之后开始，并且节括号也可能包含周围的空格。 

部分解析使用：```
section = line[1:-1].strip()
```没有第二个`strip()`，像这样的输入`[  abc  ]`会错误地存储带空格的节名称。 

作业使用：```
line.split("=", 1)
```第二个参数可以防止意外的额外分裂。 尽管官方的限制使值保持简单，但这是最安全的解析样式。 

覆盖行为自然来自字典分配。 不需要显式的重复处理。 

在输出过程中，首先打印全局范围，然后按排序顺序打印每个实际部分。 每个范围内的键在打印之前也会进行排序。 

## 工作示例

 ### 示例 1

 输入：```
11
a= 1
b=a
a = 2
 ; comment
[z]
1=2
[y]
2=3
[z]
2=1
[w]
```追踪：

 | 步骤| 线路| 当前部分 | 行动| 存储状态|
 | --- | --- | --- | --- | --- |
 | 1 |`a= 1`| 全球| 店铺`a=1`| 全球的：`{a:1}`|
 | 2 |`b=a`| 全球| 店铺`b=a`| 全球的：`{a:1,b:a}`|
 | 3 |`a = 2`| 全球| 覆盖`a`| 全球的：`{a:2,b:a}`|
 | 4 |`; comment`| 全球| 忽略 | 不变|
 | 5 |`[z]`| z | 创建部分 | z：`{}`|
 | 6 |`1=2`| z | 店铺`1=2`| z：`{1:2}`|
 | 7 |`[y]`| y | 创建部分 | y:`{}`|
 | 8 |`2=3`| y | 店铺`2=3`| y:`{2:3}`|
 | 9 |`[z]`| z | 开关部分| 不变|
 | 10 | 10`2=1`| z | 店铺`2=1`| z：`{1:2,2:1}`|
 | 11 | 11`[w]`| 瓦 | 创建空部分 | 瓦：`{}`|

 最终输出：```
a=2
b=a
[w]
[y]
2=3
[z]
1=2
2=1
```该迹线显示了两个重要的属性。 重新进入部分`z`继续修改同一字典，重复的全局键会覆盖早期的值。 

### 自定义示例

 输入：```
8
  ;ignore
[a]
x=1
x = 9
[b]
z=3
[a]
y=2
```追踪：

 | 步骤| 线路| 当前部分 | 行动| 状态|
 | --- | --- | --- | --- | --- |
 | 1 |`;ignore`| 全球| 忽略 | 空 |
 | 2 |`[a]`| 一个 | 创建部分 | 一个：`{}`|
 | 3 |`x=1`| 一个 | 商店 | 一个：`{x:1}`|
 | 4 |`x = 9`| 一个 | 覆盖| 一个：`{x:9}`|
 | 5 |`[b]`| 乙| 创建部分 | 乙：`{}`|
 | 6 |`z=3`| 乙| 商店 | 乙：`{z:3}`|
 | 7 |`[a]`| 一个 | 切换回来 | 不变|
 | 8 |`y=2`| 一个 | 商店 | 一个：`{x:9,y:2}`|

 最终输出：```
[a]
x=9
y=2
[b]
z=3
```此示例演示了重复的部分自然合并，并且覆盖仅发生在单个部分内。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log m) | 排序键和节名称占主导地位 |
 | 空间| O(米) | 存储所有幸存的键值对 |

 这里，`m`是解析后存储的分配数。 由于总输入大小仅为 10000 个字符，因此该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())

    sections = {"": {}}
    current = ""

    for _ in range(n):
        line = input().rstrip("\n").strip()

        if not line:
            continue

        if line[0] == ';':
            continue

        if line[0] == '[' and line[-1] == ']':
            section = line[1:-1].strip()

            if section not in sections:
                sections[section] = {}

            current = section
        else:
            key, value = line.split("=", 1)

            key = key.strip()
            value = value.strip()

            sections[current][key] = value

    out = []

    for key in sorted(sections[""]):
        out.append(f"{key}={sections[''][key]}")

    for section in sorted(s for s in sections if s != ""):
        out.append(f"[{section}]")

        for key in sorted(sections[section]):
            out.append(f"{key}={sections[section][key]}")

    print("\n".join(out))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return result

# provided sample
assert run(
"""11
a= 1
b=a
a = 2
 ; comment
[z]
1=2
[y]
2=3
[z]
2=1
[w]
"""
) == """a=2
b=a
[w]
[y]
2=3
[z]
1=2
2=1""", "sample 1"

# minimum case
assert run(
"""1
a=1
"""
) == """a=1""", "single global key"

# duplicate overwrite
assert run(
"""4
[a]
x=1
x=2
x=3
"""
) == """[a]
x=3""", "latest value survives"

# repeated sections merge
assert run(
"""5
[a]
x=1
[b]
y=2
[a]
"""
) == """[a]
x=1
[b]
y=2""", "same section reused"

# whitespace and comments
assert run(
"""5
   ; ignore
 [ sec ]
  a   =   9
b=2
 ;x
"""
) == """[sec]
a=9
b=2""", "space trimming"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单键|`a=1`| 最小有效输入|
 | 重复作业 |`x=3`幸存| 覆盖语义 |
 | 重复部分 | 键合并到同一部分 | 正确的部分重用 |
 | 大量空格输入 | 干净的规范化格式 | 适当的修剪和评论处理|

 ## 边缘情况

 考虑重复的节声明。 

输入：```
5
[a]
x=1
[b]
y=2
[a]
```当解析器看到第二个时`[a]`，它不会创建新字典，因为部分`a`已经存在。 它只切换`current`回到`"a"`。 存储的数据仍然是：```
a -> {x:1}
b -> {y:2}
```最终输出正确包含一个`[a]`部分。 

现在考虑在一个部分内进行覆盖。 

输入：```
4
[a]
x=1
x=5
x=9
```字典转换是：```
{x:1}
{x:5}
{x:9}
```每次赋值都会替换之前的值。 只有最新的幸存下来，完全符合规格。 

大量空格的解析是错误的另一个常见来源。 

输入：```
3
 [ abc ]
   k   =   v
 ;hello
```修剪后：```
[ abc ]
k   =   v
;hello
```部分名称变为`"abc"`取下支架并再次剥离后。 作业变为`k=v`。 评论完全消失。 

最后，全局键必须与部分键分开。 

输入：```
4
x=1
[a]
x=2
y=3
```解析器存储：```
global -> {x:1}
a -> {x:2, y:3}
```两人`x`键不会冲突，因为它们属于不同的范围。 输出是：```
x=1
[a]
x=2
y=3
```
