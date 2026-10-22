---
title: "CF 118A - 字符串任务"
description: "我们收到一个包含大写和小写英文字母的字符串。 任务是根据三个规则转换该字符串。 首先，必须删除每个元音。 本题中的元音是 A、O、Y、E、U、I，有大写和小写两种形式。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 118
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 89 (Div. 2)"
rating: 1000
weight: 118
solve_time_s: 98
verified: true
draft: false
---

[CF 118A - 字符串任务](https://codeforces.com/problemset/problem/118/A)

 **评分：** 1000
 **标签：** 实现、字符串
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到一个包含大写和小写英文字母的字符串。 任务是根据三个规则转换该字符串。 

首先，必须删除每个元音。 这个问题中的元音是`A, O, Y, E, U, I`大写和小写两种形式。 

其次，剩下的每个字符都是辅音，我们必须将其转换为小写。 

第三，在每个辅音之前我们插入一个点`.`。 

例如，字符串`Codeforces`变成`.c.d.f.r.c.s`因为元音`o`,`e`， 和`o`被删除，而剩余的辅音则变为小写并以点为前缀。 

输入长度最多为 100 个字符。 这是非常小的，因此性能不是这里关注的问题。 即使是低效的解决方案也会立即运行。 不过，最简洁的方法是对字符串进行单次线性扫描。 

棘手的部分不是复杂性，而是正确性。 一些小细节如果处理不慎很容易产生错误的答案。 

一个常见的错误是忘记大写元音。 考虑：```
Input:
aBAcAba
```正确的输出是：```
.b.c.b
```如果我们只检查小写元音，则大写`A`字符会错误地保留在答案中。 

另一个容易犯的错误是在检查每个字符是否是元音之前在每个字符前添加点。 例如：```
Input:
tour
```正确的输出是：```
.t.r
```粗心的实施可能会产生：```
.t.o.u.r
```因为它在元音之前插入点而不是完全跳过它们。 

第三个微妙的情况是正确处理大写辅音。 例如：```
Input:
QWERTY
```正确的输出是：```
.q.w.r.t
```字母`E`和`Y`是这个问题中的元音并且必须消失，而其余的辅音必须变成小写。 

## 方法

 最直接的做法就是逐个字符地处理字符串。 对于每个字符，我们检查它是否是元音。 如果不是，我们会在答案中附加一个点和该字符的小写版本。 

这已经以线性时间运行，因为每个字符都被检查一次。 

更简单的版本可以使用连接重复重建字符串，例如：```
ans = ans + "." + ch.lower()
```Python 字符串是不可变的，因此每次连接都会创建一个新字符串。 在最坏的情况下，这会导致二次行为。 即使只有 100 个字符，仍然可以轻松通过，但这不是理想的做法。 

更好的方法是建立一个片段列表并在最后将它们连接一次。 追加到列表是高效的，并且最终`"".join(...)`在线性时间内创建答案。 

关键的观察是每个字符都是独立处理的。 一个字母是否存活仅取决于该特定字母是否是元音。 位置之间没有相互作用，因此一次传递就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入字符串。 
2. 创建一个包含所有小写形式元音的集合：`{'a', 'o', 'y', 'e', 'u', 'i'}`。 

使用小写元音可以让我们在检查字符之前对其进行规范化。 
3. 创建一个空列表来存储最终答案的部分内容。 
4. 迭代字符串中的每个字符。 
5. 将当前字符转换为小写。 

这统一处理大写和小写字母。 
6. 检查小写字符是否为元音。 

如果是元音，则完全跳过。 
7. 如果是辅音，则添加`"." + character`到答案列表。 
8. 处理完所有字符后，将列表连接成一个字符串并打印。 

### 为什么它有效

 在每一步中，算法都会保持答案列表包含所有已处理字符的正确转换版本的不变性。 

当我们遇到元音时，问题要求它消失，因此跳过它可以保持正确性。 

当我们遇到辅音时，该问题需要两个操作：将其转换为小写并在其前面放置一个点。 追加`"." + lowercase_character`准确地执行这些操作。 

Since every character is processed once and according to the problem rules, the final joined string is exactly the required output.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()

vowels = set("aoyeui")
result = []

for ch in s:
    ch = ch.lower()

    if ch not in vowels:
        result.append("." + ch)

print("".join(result))
```该程序首先读取输入字符串并删除尾随换行符`strip()`。 

元音集仅包含小写字母。 该代码不是分别检查大写和小写变体，而是在进行比较之前将每个字符转换为小写。 这使逻辑简单并避免重复。 

这`result`列出存储变换后的辅音。 使用列表优于重复的字符串连接，因为 Python 字符串是不可变的。 追加到列表是高效的，并且在最后加入一次可以避免不必要的复制。 

在循环内部，每个字符都被规范化为`lower()`。 如果字符不是元音，代码会附加一个点，后跟小写辅音。 

最终输出是用`"".join(result)`。 

一个微妙的细节是操作顺序。 在检查元音集中的成员资格之前，我们必须将字符小写。 否则大写元音如`E`或者`Y`会错误地生存。 

## 工作示例

 ### 示例 1

 输入：```
tour
```| 当前角色 | 小写 | 元音？ | 结果列表 |
 | --- | --- | --- | --- |
 | t | t | 没有 | [“.t”] |
 | 哦| 哦| 是的 | [“.t”] |
 | 你| 你| 是的 | [“.t”] |
 | r | r | 没有 | [“.t”，“.r”] |

 最终输出：```
.t.r
```这个例子表明元音被完全删除而不是被转换。 

### 示例 2

 输入：```
Codeforces
```| 当前角色 | 小写 | 元音？ | 结果列表 |
 | --- | --- | --- | --- |
 | C | c | 没有 | [“.c”] |
 | 哦| 哦| 是的 | [“.c”] |
 | d | d | 没有 | [“.c”，“.d”] |
 | 电子| 电子| 是的 | [“.c”，“.d”] |
 | f | f | 没有 | [“.c”，“.d”，“.f”] |
 | 哦| 哦| 是的 | [“.c”，“.d”，“.f”] |
 | r | r | 没有 | [“.c”，“.d”，“.f”，“.r”] |
 | c | c | 没有 | [“.c”，“.d”，“.f”，“.r”，“.c”] |
 | 电子| 电子| 是的 | [“.c”，“.d”，“.f”，“.r”，“.c”] |
 | s | s | 没有 | [“.c”，“.d”，“.f”，“.r”，“.c”，“.s”] |

 最终输出：```
.c.d.f.r.c.s
```该跟踪表明，无论大小写，大写辅音都会正确转换，并且元音都会消失。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符只处理一次 |
 | 空间| O(n) | 结果列表存储转换后的输出 |

 最大输入大小仅为 100 个字符，因此该算法很容易满足限制。 即使较慢的方法也可以通过，但线性解决方案既干净又高效。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    s = input().strip()

    vowels = set("aoyeui")
    result = []

    for ch in s:
        ch = ch.lower()

        if ch not in vowels:
            result.append("." + ch)

    print("".join(result))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run("tour\n") == ".t.r", "sample 1"

# custom cases
assert run("a\n") == "", "single vowel should disappear"
assert run("b\n") == ".b", "single consonant"
assert run("Codeforces\n") == ".c.d.f.r.c.s", "mixed uppercase and lowercase"
assert run("QWERTY\n") == ".q.w.r.t", "uppercase vowels removed correctly"
assert run("abcdefghijklmnopqrstuvwxyz\n") == ".b.c.d.f.g.h.j.k.l.m.n.p.q.r.s.t.v.w.x.z", "full alphabet case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`| 空字符串| 单元音去除|
 |`b`|`.b`| 单辅音格式 |
 |`Codeforces`|`.c.d.f.r.c.s`| 混合大小写和多个元音 |
 |`QWERTY`|`.q.w.r.t`| 大写元音处理 |
 |`abcdefghijklmnopqrstuvwxyz`|`.b.c.d.f.g.h.j.k.l.m.n.p.q.r.s.t.v.w.x.z`| 完全遍历和所有元音去除 |

 ## 边缘情况

 考虑输入：```
A
```该算法转换`A`改为小写`a`。 自从`a`是元音，它被跳过。 结果列表保持为空，因此输出为空字符串。 这证实了大写元音处理正确。 

考虑输入：```
BCDF
```处理步骤为：`B -> b -> append ".b"`

`C -> c -> append ".c"`

`D -> d -> append ".d"`

`F -> f -> append ".f"`最终输出变为：```
.b.c.d.f
```这证实了每个辅音都恰好收到一个前导点。 

考虑输入：```
Yy
```两个字符都变成小写`y`。 自从`y`在此问题中被视为元音，两者都被跳过。 输出为空。 

一个常见的错误是忘记了`Y`在这里算作元音，尽管许多其他问题对其进行不同的分类。 

最后，考虑：```
Input:
aBAcAba
```处理顺序为：`a -> vowel -> skip`

`B -> b -> append ".b"`

`A -> a -> skip`

`c -> c -> append ".c"`

`A -> a -> skip`

`b -> b -> append ".b"`

`a -> a -> skip`最终输出是：```
.b.c.b
```此示例确认在辅音格式化发生之前删除大写元音。
