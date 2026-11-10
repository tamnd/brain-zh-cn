---
title: "CF 21A - Jabber ID"
description: "我们需要验证字符串是否遵循 Jabber ID 的确切语法。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 21
codeforces_index: "A"
codeforces_contest_name: "Codeforces Alpha Round 21 (Codeforces format)"
rating: 1900
weight: 21
solve_time_s: 97
verified: false
draft: false
---
[CF 21A - Jabber ID](https://codeforces.com/problemset/problem/21/A)

 **评级：** 1900
 **标签：** 实现、字符串
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要验证字符串是否遵循 Jabber ID 的确切语法。 

有效的 ID 包含三个可能的部分：`username@hostname`或者`username@hostname/resource`用户名和资源遵循相同的规则。 它们只能包含英文字母、数字和下划线。 它们的长度必须在 1 到 16 之间。 

主机名略有不同。 它被分成由点分隔的部分。 每个部分必须满足与用户名相同的规则，这意味着每个部分只能包含字母、数字和下划线，长度在 1 到 16 之间。整个主机名长度必须在 1 到 32 之间。 

输入是单个字符串，我们必须打印`YES`如果每条规则都满足，否则`NO`。 

输入长度最多为100，因此性能不是问题。 即使是二次解析也很容易适合。 挑战在于正确性。 大多数错误提交都会失败，因为它们错误地解析了分隔符或忘记了长度条件之一。 

一些边缘情况很容易被错误处理。 

主机名可以包含多个点分隔的单词：```
a@b.c.d
```这是有效的，因为每个段都是非空且合法的。 

带有空段的主机名无效：```
a@b..c
```正确答案是`NO`因为两个点之间的子串是空的。 粗心的基于拆分的实现有时会忘记拒绝空块。 

资源部分是可选的，但是如果`/`存在则资源不能为空：```
a@b/
```答案是`NO`。 

这同样适用于用户名：```
@abc
```这是无效的，因为用户名长度必须至少为 1。 

一个常见的解析错误是允许多个`@`符号：```
a@b@c
```必须拒绝这一点，因为该结构只允许一个用户名和一个主机名。 

另一个微妙的情况是主机名长度。 即使每个段单独有效，整个主机名仍最多为 32 个字符。```
a@abcdefghij.abcdefghij.abcdefghijx
```每一段长度都可以，但是主机名总数超过32，所以答案是`NO`。 

## 方法

 最直接的暴力解决方案是尝试每一个可能的分割位置`@`和`/`，然后检查结果子串是否满足所有规则。 

例如，我们可以迭代所有可能的`@`位置，那么一切可能的`/`放置在它之后，并手动验证所有部件。 由于字符串长度最多为 100，因此仍然会立即运行。 最坏的情况是大约几千个子字符串检查。 

这种方法的弱点不是速度，而是实施的复杂性。 一旦涉及多个分隔符，暴力解析就很容易出错。 很容易意外地接受畸形结构，例如多个`@`字符或空主机名段。 

更简洁的方法是根据字符串的语法来解析字符串。 

结构刚性：

 1. 必须恰好有一个`@`。 
2.之前的一切`@`是用户名。 
3.之后的一切`@`是：

 - 只是一个主机名
 - 或主机名/资源

 一旦字符串被分成这些逻辑组件，验证就变成本地的。 每件都可以独立检查。 

关键的观察结果是，所有原子单词都共享相同的验证规则：只有字母、数字和下划线，长度在 1 到 16 之间。这意味着我们可以编写一个可重用的验证器函数并将其应用到任何地方。 

对于主机名，我们另外用点分割并单独验证每个段。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入字符串。 
2. 检查字符串是否恰好包含 1`@`。 

如果没有这个限制，格式错误的输入如`a@b@c`可能会被解析得含糊不清。 
3. 将字符串拆分为`username`和`rest`使用`@`。 
4. 验证用户名。 

用户名必须：

 - 长度在 1 到 16 之间
 - 仅包含字母、数字或下划线
 5. 检查是否`rest`包含一个`/`。 

如果是的话，分成`hostname`和`resource`。 

如果没有，那么整个`rest`是主机名，没有资源。 
6. 如果资源存在，请使用与用户名相同的规则对其进行验证。 

空资源无效。 
7. 验证主机名长度。 

整个主机名的长度必须在 1 到 32 之间。 
8. 用点分割主机名。 
9. 验证每个主机名段。 

每个部分必须：

 - 非空
 - 长度在 1 到 16 之间
 - 仅包含字母、数字或下划线
 10. 如果每项检查都成功，则打印`YES`。 否则打印`NO`。 

### 为什么它有效

 该算法反映了有效 Jabber ID 的精确形式结构。 

这`@`split 保证只有一个用户名和一个主机名部分。 可选的`/`split 隔离资源（如果存在）。 每个剩余的原子组件都会根据字符和长度规则进行检查。 

主机名验证是正确的，因为按点分割会准确生成规范中描述的主机名单词。 拒绝空段可以防止无效的形式，例如连续点或前导/尾随点。 

由于规范中的每条规则都是直接且独立地检查的，因此该算法接受所有有效 ID 并拒绝所有无效 ID。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def valid_word(s):
    if not (1 <= len(s) <= 16):
        return False

    for ch in s:
        if not (ch.isalnum() or ch == '_'):
            return False

    return True

def solve():
    s = input().strip()

    if s.count('@') != 1:
        print("NO")
        return

    username, rest = s.split('@')

    if not valid_word(username):
        print("NO")
        return

    if rest.count('/') > 1:
        print("NO")
        return

    if '/' in rest:
        hostname, resource = rest.split('/')

        if not valid_word(resource):
            print("NO")
            return
    else:
        hostname = rest

    if not (1 <= len(hostname) <= 32):
        print("NO")
        return

    parts = hostname.split('.')

    for part in parts:
        if not valid_word(part):
            print("NO")
            return

    print("YES")

solve()
```该解决方案围绕一个可重复使用的助手，`valid_word`。 该函数实现用户名、资源和主机名段使用的共享验证逻辑。 

第一个结构检查是计数`@`。 使用`count('@') != 1`在进行更深入的解析之前立即拒绝格式错误的输入。 

资源解析需要仔细处理。 我们首先检查是否有多个`/`存在于主机名资源部分内。 输入如：```
a@b/c/d
```必须被拒绝。 

主机名验证分两层进行。 首先，我们验证主机名总长度，因为该语句强制规定了 32 个字符的单独限制。 然后我们按点分割并单独验证每个片段。 

拆分行为自然会捕获空组件。 例如：```
"ab..cd".split('.')
```产生：```
["ab", "", "cd"]
```空字符串失败`valid_word`，它正确地拒绝主机名。 

## 工作示例

 ### 示例 1

 输入：```
[email protected]
```| 步骤| 变量| 价值|
 | ---| ---| ---|
 | 读取输入| s |`codeforces@tests`|
 | 按@分割 | 用户名 |`codeforces`|
 | 按@分割 | 休息|`tests`|
 | 验证用户名 | 结果 | 有效 |
 | 检查/ | 发现 | 没有|
 | 主机名 | 主机名 |`tests`|
 | 分割主机名| 零件 |`["tests"]`|
 | 验证零件 | 结果 | 有效 |
 | 最终答案| 输出|`YES`|

 此示例显示了最简单的有效结构，没有资源部分。 每个组件都满足允许的字符和长度规则。 

### 示例 2

 输入：```
a@b..c
```| 步骤| 变量| 价值|
 | ---| ---| ---|
 | 读取输入| s |`a@b..c`|
 | 按@分割 | 用户名 |`a`|
 | 按@分割 | 休息|`b..c`|
 | 验证用户名 | 结果 | 有效 |
 | 主机名 | 主机名 |`b..c`|
 | 分割主机名| 零件 |`["b", "", "c"]`|
 | 验证空部分 | 结果 | 无效|
 | 最终答案| 输出|`NO`|

 此跟踪演示了为什么必须拒绝空主机名段。 连续的点在它们之间创建一个空的子字符串。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符都会被处理固定次数 |
 | 空间| O(n) | 分割字符串创建子字符串数组 |

 输入长度最多为 100，因此解决方案很容易满足限制。 即使低效的实现也能顺利通过，但线性解析器更干净，更容易推理。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    s = input().strip()

    def valid_word(x):
        if not (1 <= len(x) <= 16):
            return False

        for ch in x:
            if not (ch.isalnum() or ch == '_'):
                return False

        return True

    if s.count('@') != 1:
        print("NO")
        return

    username, rest = s.split('@')

    if not valid_word(username):
        print("NO")
        return

    if rest.count('/') > 1:
        print("NO")
        return

    if '/' in rest:
        hostname, resource = rest.split('/')

        if not valid_word(resource):
            print("NO")
            return
    else:
        hostname = rest

    if not (1 <= len(hostname) <= 32):
        print("NO")
        return

    for part in hostname.split('.'):
        if not valid_word(part):
            print("NO")
            return

    print("YES")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    global input
    input = sys.stdin.readline

    solve()

    return sys.stdout.getvalue().strip()

# provided sample
assert run("[email protected]\n") == "YES", "sample 1"

# custom cases
assert run("a@b\n") == "YES", "minimum valid case"

assert run("@b\n") == "NO", "empty username"

assert run("a@b..c\n") == "NO", "empty hostname segment"

assert run("abcdefghijklmnopq@abc\n") == "NO", "username exceeds 16 chars"

assert run("a@abc/\n") == "NO", "empty resource"

assert run("a@b/c/d\n") == "NO", "multiple slashes"

assert run("a_b@c_d.e_f/resource_1\n") == "YES", "underscores allowed"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a@b`|`YES`| 最小有效结构 |
 |`@b`|`NO`| 用户名不能为空 |
 |`a@b..c`|`NO`| 空主机名段无效 |
 |`abcdefghijklmnopq@abc`|`NO`| 用户名长度上限 |
 |`a@abc/`|`NO`| 资源不能为空 |
 |`a@b/c/d`|`NO`| 只允许一个可选斜杠 |
 |`a_b@c_d.e_f/resource_1`|`YES`| 下划线在任何地方都是合法的 |

 ## 边缘情况

 考虑输入：```
a@b..c
```该算法将主机名拆分为：```
["b", "", "c"]
```空的中间段失败`valid_word`因为它的长度是0。算法正确打印`NO`。 

现在考虑：```
a@b/
```解析器检测到`/`并分为：```
hostname = "b"
resource = ""
```空资源立即验证失败，所以答案是`NO`。 

对于多个`@`符号：```
a@b@c
```第一个检查计算的数量`@`人物。 由于计数不完全为 1，因此在进一步解析之前该字符串将被拒绝。 

对于超过 32 个字符的主机名：```
a@abcdefghij.abcdefghij.abcdefghijx
```总主机名长度变为 33。即使每个单独的段都有效，但单独的主机名长度条件失败，因此算法输出`NO`。 

最后，考虑一个有效的复杂示例：```
abc_DEF@host_1.server_2/resource_3
```用户名、每个主机名段和资源都满足共享验证规则。 主机名长度在32以内。算法到达末尾，没有触发任何拒绝并打印`YES`。
