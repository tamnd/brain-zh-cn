---
title: "CF 162H - 交替情况"
description: "我们得到一个包含任意大写英文字母的字符串。 任务是重写字符串，使奇数位置的字符变为大写，偶数位置的字符变为小写。 位置是从 1 开始计算的，而不是从 0 开始计算。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 162
codeforces_index: "H"
codeforces_contest_name: "VK Cup 2012 Wild-card Round 1"
rating: 1800
weight: 162
solve_time_s: 191
verified: false
draft: false
---

[CF 162H - 交替情况](https://codeforces.com/problemset/problem/162/H)

 **评分：** 1800
 **标签：** *特别
 **求解时间：** 3m 11s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个包含任意大写英文字母的字符串。 任务是重写字符串，使奇数位置的字符变为大写，偶数位置的字符变为小写。 位置是从 1 开始计算的，而不是从 0 开始计算。 

例如，如果输入是`Codeforces`，第一个字符应变为大写，第二个字符应变为小写，第三个字符应再次变为大写，依此类推。 结果字符串是`CoDeFoRcEs`。 

限制很小。 字符串长度最多为 100 个字符，因此即使是低效的方法也可以立即运行。 对字符串进行线性扫描就足够了。 由于每个字符都是独立处理的，因此自然的解决方案是迭代字符串一次并根据位置奇偶校验来决定大小写。 

错误的主要来源是索引。 Python 使用基于 0 的索引，而问题描述的是从 1 开始的位置。粗心的实现可能会意外颠倒模式。 

考虑输入：```
abcde
```正确的输出是：```
AbCdE
```如果我们错误地对待索引`0`作为问题陈述意义上的偶数位置，我们将产生：```
aBcDe
```另一个容易犯的错误是在应用图案之前忘记对原始外壳进行标准化。 输入的任意位置可能已包含大写字母。 

例如：```
aBcD
```正确的输出是：```
AbCd
```如果我们只修改奇数位置的字符而其他位置保持不变，结果可能仍然不正确。 

单字符字符串是另一种边界情况：```
z
```答案一定是：```
Z
```第一个位置始终是奇数，因此字符必须始终变为大写。 

## 方法

 暴力破解的方法在这里已经很简单了。 我们可以逐个字符地遍历字符串，检查当前位置是奇数还是偶数，并将字符的大写或小写版本附加到答案中。 

由于最大长度仅为 100，即使重复重建字符串也仍然足够快。 在循环内使用字符串连接的简单实现最多执行大约 100 次连接，这是可以忽略不计的。 

更干净且更具可扩展性的方法使用字符列表并在最后将它们连接起来。 这避免了重复的字符串重新分配并符合标准的竞争性编程风格。 

关键的观察是每个角色都独立于其他角色。 位置之间没有交互，没有动态规划状态，也不需要预处理。 所需的情况仅取决于位置号是奇数还是偶数。 

这将整个问题简化为单个线性传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入字符串。 
2. 创建一个空列表来存储转换后的字符。 
3. 使用以下索引迭代字符串`0`到`n - 1`。 
4. 对于每个字符，确定其在基于 1 的索引中的位置是奇数还是偶数。 

由于Python索引是从0开始的，索引`0`对应位置`1`， 指数`1`对应位置`2`， 等等。 
5. 如果索引为偶数，则将字符转换为大写并将其附加到答案列表中。 

偶数索引对应于问题陈述中的奇数位置。 
6. 否则，将字符转换为小写并追加。 
7. 将列表中的所有字符连接成一个字符串。 
8. 打印结果。 

### 为什么它有效

 在每次迭代中，算法都会严格执行语句所需的规则。 指数`i`对应位置`i + 1`。 

如果`i`是偶数，那么`i + 1`是奇数，所以字符必须是大写。 

如果`i`是奇数，那么`i + 1`是偶数，所以字符必须是小写。 

每个字符都根据正确的位置规则独立进行转换，因此在处理所有位置后，得到的字符串在各处都满足大小写交替的要求。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()

ans = []

for i, ch in enumerate(s):
    if i % 2 == 0:
        ans.append(ch.upper())
    else:
        ans.append(ch.lower())

print("".join(ans))
```该程序首先读取输入字符串并删除尾随换行符`strip()`。 

答案是使用列表构建的，因为附加到列表是有效的。 处理完所有字符后，`"".join(ans)`在一次操作中构建最终字符串。 

关键的实现细节是奇偶校验。 该问题使用从 1 开始的位置，但 Python 索引从 0 开始。这意味着索引`0`代表位置`1`，它是奇数并且必须是大写的。 

这就是条件检查的原因：```
if i % 2 == 0
```而不是检查奇数索引。 

使用`upper()`和`lower()`即使输入已经包含混合大小写，也可以直接保证正确性。 

## 工作示例

 ### 示例 1

 输入：```
Codeforces
```| 指数`i`| 人物 | 位置`i+1`| 行动| 到目前为止的结果 |
 | ---| ---| ---| ---| ---|
 | 0 | C | 1 | 大写| C |
 | 1 | 哦| 2 | 小写 | 有限公司 |
 | 2 | d | 3 | 大写 | 货到付款 |
 | 3 | 电子| 4 | 小写| 代码|
 | 4 | f | 5 | 大写 | 代码 |
 | 5 | 哦| 6 | 小写 | 代码DeFo |
 | 6 | r | 7 | 大写 | 代码|
 | 7 | c | 8 | 小写 | 代码|
 | 8 | 电子| 9 | 大写| 代码力量 |
 | 9 | s | 10 | 10 小写| 代码力量 |

 最终输出：```
CoDeFoRcEs
```该迹线清楚地显示了交替模式。 每个奇数位置都变为大写，每个偶数位置都变为小写。 

### 示例 2

 输入：```
aBcD
```| 指数`i`| 人物 | 位置`i+1`| 行动| 到目前为止的结果 |
 | ---| ---| ---| ---| ---|
 | 0 | 一个 | 1 | 大写| 一个 |
 | 1 | 乙| 2 | 小写| 抗体 |
 | 2 | c | 3 | 大写| ABC |
 | 3 | d | 4 | 小写| AbCd |

 最终输出：```
AbCd
```这个例子说明了为什么我们必须显式调用`upper()`和`lower()`而不是假设输入已经具有正确的大小写。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符被处理一次 |
 | 空间| O(n) | 答案列表存储转换后的字符串 |

 和`n ≤ 100`，程序在限制内立即运行。 内存使用量也很小，因为该算法仅存储结果字符串。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    s = input().strip()

    ans = []

    for i, ch in enumerate(s):
        if i % 2 == 0:
            ans.append(ch.upper())
        else:
            ans.append(ch.lower())

    print("".join(ans))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("Codeforces\n") == "CoDeFoRcEs", "sample 1"

# minimum size
assert run("z\n") == "Z", "single character"

# already alternating
assert run("AbCdE\n") == "AbCdE", "already correct"

# all lowercase
assert run("abcdef\n") == "AbCdEf", "lowercase input"

# all uppercase
assert run("ABCDEF\n") == "AbCdEf", "uppercase input"

# off-by-one check
assert run("ab\n") == "Ab", "index parity correctness"

# maximum length
assert run(("a" * 100) + "\n") == ("Ab" * 50), "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`z`|`Z`| 最小长度输入 |
 |`AbCdE`|`AbCdE`| 已经正确的模式 |
 |`abcdef`|`AbCdEf`| 小写标准化 |
 |`ABCDEF`|`AbCdEf`| 大写标准化 |
 |`ab`|`Ab`| 正确处理从 1 开始的奇偶校验 |
 |`a * 100`|`AbAb...`| 最大允许长度|

 ## 边缘情况

 A single-character string is the smallest possible input:```
z
```算法处理索引`0`。 自从`0`为偶数时，字符变为大写。 输出是：```
Z
```这证实了第一个位置已正确处理。 

混合大小写可能会暴露无法正确规范大小写的实现。 

输入：```
aBcD
```该算法不信任现有的大小写。 在索引处`1`, 字符`B`转换为小写，因为它对应于位置`2`。 在索引处`2`, 字符`c`变为大写，因为它对应于位置`3`。 

最终结果是：```
AbCd
```在基于 0 的索引和基于 1 的索引之间转换时，很容易出现差一错误。 

输入：```
ab
```指数`0`映射到位置`1`， 所以`a`变为大写。 

指数`1`映射到位置`2`， 所以`b`变为小写。 

输出是：```
Ab
```不正确的奇偶校验条件会产生`aB`，这违反了问题陈述。
