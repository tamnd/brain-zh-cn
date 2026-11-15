---
title: "CF 49A - 侦探"
description: "我们得到一个代表问题的句子。 句子总是以问号结尾，但答案由问号之前的最后一个字母决定。 如果最后一个字母是元音，则正确的答案是“YES”。"YES\"."
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 49
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 46 (Div. 2)"
rating: 800
weight: 49
solve_time_s: 81
verified: true
draft: false
---
[CF 49A - 侦探](https://codeforces.com/problemset/problem/49/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表问题的句子。 句子总是以问号结尾，但答案由问号之前的最后一个字母决定。 如果最后一个字母是元音，则正确的答案是`"YES"`。 否则，响应是`"NO"`。 

这个问题中的元音有点不寻常，因为`Y`也被视为元音。 大写和小写字母都可能出现，因此比较必须不区分大小写。 

输入的长度最多为 100 个字符，这个长度很小。 即使多次完整扫描字符串也很容易满足限制。 问题纯粹是关于正确识别最后一个字母并检查它是否属于元音集。 

棘手的部分是最后一个字符总是`?`，但答案取决于最后一个字母，而不是最后一个字符。 空格也不计算在内。 粗心的实施检查`s[-1]`总是会检查`?`并立即失败。 

考虑这个输入：```
Is it a melon?
```最后一个字母是`n`，这是一个辅音，所以正确答案是：```
NO
```另一个容易犯的错误是忘记大小写转换。 例如：```
A?
```最后一个字母是大写的`A`，它仍然是一个元音。 如果不转换为小写或显式处理这两种情况，程序可能会错误地打印`"NO"`。 

根据该语句，尾随空格不存在，但句子内的空格很重要，因为最后一个字母可能离结尾很远。 例如：```
Is this a UFO ?
```最后一个有意义的字母是`O`，不是前面的空格`?`。 

## 方法

 最直接的方法是从字符串末尾向后扫描，直到遇到字母。 一旦找到它，我们就检查它是否属于元音集`{a, e, i, o, u, y}`。 如果是，我们打印`"YES"`， 否则`"NO"`。 

一种强力解释是检查字符串中的每个字符并记住迄今为止看到的最后一个字母字符。 由于字符串长度最多为 100，因此运行速度已经相当快了。 最坏的情况仅执行 100 个字符检查。 

我们可以通过利用输入的结构使实现稍微干净一些。 字符串总是以`?`，并且保证至少有一个字母。 因此，向后扫描会立即找到相关字符，而无需存储任何额外内容。 

关键的观察结果是，只有一个字符重要，即句子中的最后一个字母。 其他一切都无关紧要。 一旦我们分离出该字母，问题就简化为元音集中的简单隶属度测试。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) | O(1) | O(1) | 已接受 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将整个输入行作为字符串读取。 
2. 创建一个包含所有小写元音的集合：```
{a, e, i, o, u, y}
```3. 从右向左遍历字符串。 
4. 忽略任何非字母的字符。 

这会跳过最后的`?`以及末尾附近的任何空格。 
5. 找到第一个字母后，将其转换为小写。 
6. 检查这个小写字母是否属于元音集。 

如果是，则打印`"YES"`。 否则，打印`"NO"`。 
7. 处理完第一个有效字母后立即停止，因为只有最后一个字母重要。 

### 为什么它有效

 向后扫描保证我们遇到的第一个字母字符正是问题的最后一个字母。 游戏规则仅取决于该字母。 转换为小写会消除大写和小写输入之间的任何区别，因此元音集中的成员资格可以正确确定每种情况下的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()

vowels = set("aeiouy")

for ch in reversed(s):
    if ch.isalpha():
        if ch.lower() in vowels:
            print("YES")
        else:
            print("NO")
        break
```该程序首先将整个问题作为字符串读取。 使用`strip()`删除输入读取引入的尾随换行符。 

元音集以小写形式存储。 这使我们能够标准化每个候选字母`lower()`在检查会员资格之前。 

该循环以相反的顺序迭代字符串。 这是定位最终有意义的字母的最简洁的方法，因为输入总是以`?`。 

这`isalpha()`检查是必要的。 如果没有它，程序将检查标点符号或空格而不是字母。 一旦找到有效的字母，程序就会判断它是否是元音并立即打印答案。 

这`break`声明很重要，因为只有最后一个字母会影响结果。 继续扫描可能会意外覆盖正确的决定。 

## 工作示例

 ### 示例 1

 输入：```
Is it a melon?
```| 当前角色 | 是信| 小写 | 元音？ | 行动|
 | --- | --- | --- | --- | --- |
 |`?`| 没有 | - | - | 跳过|
 |`n`| 是的 |`n`| 没有 | 打印`NO`|

 扫描跳过问号，立即到达`n`。 自从`n`不在元音集中，答案是`"NO"`。 

### 示例 2

 输入：```
Are YOU happy?
```| 当前角色 | 是信| 小写 | 元音？ | 行动|
 | --- | --- | --- | --- | --- |
 |`?`| 没有 | - | - | 跳过|
 |`y`| 是的 |`y`| 是的 | 打印`YES`|

 此示例演示了两个细节。 首先，算法正确地忽略了`?`。 第二，`y`在这个问题中被视为元音，所以答案变成`"YES"`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 在最坏的情况下，我们扫描整个字符串一次 |
 | 空间| O(1) | O(1) | 仅使用了一个小的元音集和几个变量 |

 由于输入长度永远不会超过 100 个字符，因此即使线性扫描实际上也是瞬时的。 内存使用量恒定且远低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    s = input().strip()

    vowels = set("aeiouy")

    for ch in reversed(s):
        if ch.isalpha():
            if ch.lower() in vowels:
                print("YES")
            else:
                print("NO")
            break

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run("Is it a melon?\n") == "NO\n", "sample 1"

# custom cases
assert run("A?\n") == "YES\n", "single uppercase vowel"
assert run("b?\n") == "NO\n", "single lowercase consonant"
assert run("Why?\n") == "YES\n", "y treated as vowel"
assert run("Is this a UFO ?\n") == "YES\n", "space before question mark"
assert run(("a" * 99) + "?\n") == "YES\n", "maximum length style case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A?`|`YES`| 大写元音处理 |
 |`b?`|`NO`| 单辅音大小写|
 |`Why?`|`YES`|`y`算作元音 |
 |`Is this a UFO ?`|`YES`| 忽略前面的空格`?`|
 |`aaaa...a?`|`YES`| 接近最大尺寸的长输入 |

 ## 边缘情况

 考虑输入：```
A?
```该算法从后面扫描。 它会跳过`?`，达到`A`, 将其转换为小写`a`，并在元音集中找到它。 输出变为：```
YES
```这证实了大写字母已正确处理。 

现在考虑：```
Is this a UFO ?
```反向遍历的过程如下：```
? -> skip
(space) -> skip
O -> valid letter
```转换后`O`改为小写`o`，算法将其识别为元音并打印：```
YES
```此案例证实靠近末尾的空格不会干扰查找最后一个字母。 

最后，检查：```
Why?
```最后一个字母是`y`。 有些实现忘记了这一点`y`包含在这个问题的元音之中。 该算法显式存储`y`在元音集中，因此它正确打印：```
YES
```
