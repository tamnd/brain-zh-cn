---
title: "CF 41A - 翻译"
description: "我们得到两个小写字符串。 第一个字符串是一种语言中的单词，第二个字符串应该是其翻译成另一种语言，其中每个单词都是倒着写的。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 41
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 40 (Div. 2)"
rating: 800
weight: 41
solve_time_s: 74
verified: true
draft: false
---
[CF 41A - 翻译](https://codeforces.com/problemset/problem/41/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到两个小写字符串。 第一个字符串是一种语言中的单词，第二个字符串应该是其翻译成另一种语言，其中每个单词都是倒着写的。 

任务只是检查第二个字符串是否与第一个字符串完全相反。 如果是，我们打印`YES`。 否则，我们打印`NO`。 

每个字符串的最大长度仅为 100 个字符。 有了如此小的限制，即使是低效的方法也能在时间限制内顺利运行。 扫描一次字符串的解决方案已经足够了。 不需要高级的数据结构或优化技巧。 

这个问题的主要危险不是性能，而是正确性。 粗心的实现可能会意外地接受无效的情况。 

一个容易犯的错误是忘记比较完整的反转字符串。 例如：```
abc
ab
```正确的输出是：```
NO
```第二根弦较短，因此不可能与第一根弦相反。 任何仅比较匹配位置直到一个字符串结束的实现都会错误地接受这种情况。 

另一个常见错误是通过比较相同方向的字符来错误地反转。 考虑：```
abc
cba
```正确的输出是：```
YES
```如果我们比较`s[i]`和`t[i]`直接代替`t[n - 1 - i]`，我们会拒绝有效的翻译。 

最后的边缘情况是单字符字符串：```
a
a
```正确的输出是：```
YES
```单字符字符串等于其自身的反转，因此答案仍必须被接受。 

## 方法

 暴力破解的想法是手动构建第一个字符串的反转版本。 我们可以从最后一个字符开始迭代`s`到第一个并将每个字符附加到一个新字符串中。 构造反转字符串后，我们将其与`t`。 

这是有效的，因为反转的单词是唯一定义的。 如果每个字符以相反的顺序出现，则翻译是正确的。 

这种方法的缺点是，在字符串不可变的语言中，重复的字符串连接可能会变得低效。 每个追加都可能创建一个新字符串，这在最坏的情况下可能会导致二次行为。 由于最大长度仅为 100，这仍然很容易通过，但这不是最简洁的实现。 

关键的观察结果是该问题已经与内置操作直接匹配。 我们可以一步反转字符串并立即比较结果，而不是手动重建反转。 

在Python中，`s[::-1]`创建反转的字符串。 一旦我们计算了它，问题就简化为单个相等性检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取第一个字符串`s`。 
2.读取第二个字符串`t`。 
3. 反转`s`使用切片。 
4. 将反转后的字符串与`t`。 
5. 如果相等，则打印`YES`。 否则，打印`NO`。 

这种比较之所以有效，是因为反转会保留每个字符，而仅更改顺序。 当且仅当翻译正确执行时，两个字符串才完全匹配。 

### 为什么它有效

 该算法直接检查翻译的定义属性。 有效的翻译单词必须包含与原始单词完全相同的字符，但顺序相反。 

如果`reverse(s) == t`，每个位置都与所需的反转字符匹配，因此翻译是正确的。 

即使只有一个字符不同，或者长度不同，相等性检查也会自动失败，因此翻译无效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
t = input().strip()

if s[::-1] == t:
    print("YES")
else:
    print("NO")
```该程序首先从标准输入读取两个字符串。 使用`.strip()`删除输入读取产生的尾随换行符。 

表达式`s[::-1]`创建字符串的反向副本。 Python 切片在内部处理反转，因此我们不需要手动循环。 

相等性检查会自动比较长度和字符顺序。 这可以避免部分匹配可能错误通过的细微错误。 

实现时间很短，因为问题本身从根本上来说很简单。 主要思想是认识到反转字符串正是所需的操作。 

## 工作示例

 ### 示例 1

 输入：```
code
edoc
```| 步骤| 价值|
 | ---| ---|
 | 原字符串`s`|`code`|
 | 反转`s`|`edoc`|
 | 目标字符串`t`|`edoc`|
 | 对比结果| 平等|
 | 输出|`YES`|

 的反转版本`code`正是`edoc`，所以翻译是有效的。 

### 示例 2

 输入：```
hello
ollehh
```| 步骤| 价值|
 | ---| ---|
 | 原字符串`s`|`hello`|
 | 反转`s`|`olleh`|
 | 目标字符串`t`|`ollehh`|
 | 对比结果| 不等于|
 | 输出|`NO`|

 这个例子表明匹配前缀是不够的。 字符串必须完全匹配，包括长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 反转和比较都扫描字符串一次 |
 | 空间| O(n) | 暂时存储反转后的字符串 |

 最大字符串长度仅为 100，因此该解决方案很容易满足时间和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    s = input().strip()
    t = input().strip()

    if s[::-1] == t:
        print("YES")
    else:
        print("NO")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output.strip()

# provided sample
assert run("code\nedoc\n") == "YES", "sample 1"

# minimum-size input
assert run("a\na\n") == "YES", "single character"

# different lengths
assert run("abc\nab\n") == "NO", "length mismatch"

# same letters but wrong order
assert run("abcd\nabdc\n") == "NO", "incorrect reversal"

# maximum-size style case
s = "a" * 100
t = "a" * 100
assert run(f"{s}\n{t}\n") == "YES", "maximum equal strings"

# palindrome
assert run("level\nlevel\n") == "YES", "palindrome case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a / a`|`YES`| 最小尺寸输入 |
 |`abc / ab`|`NO`| 长度不匹配处理 |
 |`abcd / abdc`|`NO`| 字符顺序不正确 |
 | 100`'a'`人物 |`YES`| 最大允许长度|
 |`level / level`|`YES`| 反转后回文保持不变 |

 ## 边缘情况

 考虑字符串具有不同长度的情况：```
abc
ab
```该算法计算：```
reverse("abc") = "cba"
```然后比较一下`"cba"`和`"ab"`。 

字符串不同，因此输出变为：```
NO
```这证实了该算法不会意外地接受部分匹配。 

现在考虑一个回文：```
level
level
```该算法计算：```
reverse("level") = "level"
```由于反转后的字符串与原始字符串相同，因此比较成功，输出为：```
YES
```这验证了与其自身相反的字符串是否被正确处理。 

最后，考虑字符匹配但顺序不匹配的情况：```
abcd
abdc
```该算法计算：```
reverse("abcd") = "dcba"
```比较`"dcba"`和`"abdc"`立即失败，产生：```
NO
```这表明该解决方案检查精确的反向顺序，而不仅仅是字符集。
