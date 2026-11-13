---
title: "CF 236A - 男孩或女孩"
description: "我们得到的用户名仅由小写英文字母组成。 任务是计算该用户名中出现了多少个不同的字符。 决策规则很简单。 如果不同字符的数量是偶数，我们将打印“CHAT WITH HER!”。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 236
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 146 (Div. 2)"
rating: 800
weight: 236
solve_time_s: 207
verified: true
draft: false
---

[CF 236A - 男孩或女孩](https://codeforces.com/problemset/problem/236/A)

 **评分：** 800
 **标签：** 暴力破解、实现、字符串
 **求解时间：** 3m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到的用户名仅由小写英文字母组成。 任务是计算该用户名中出现了多少个不同的字符。 

决策规则很简单。 如果不同字符的数量是偶数，我们打印`"CHAT WITH HER!"`。 如果数字是奇数，我们打印`"IGNORE HIM!"`。 

输入尺寸很小。 用户名长度最多为 100 个字符，因此即使效率相对较低的方法也能在时间限制内顺利运行。 二次解最多可以执行大约 10,000 个字符比较，这对于现代硬件来说是微不足道的。 这意味着问题不在于优化压力，而在于正确且干净地实现逻辑。 

错误的主要原因是误解了“独特字符”的含义。 我们只对每个唯一字母计数一次，无论它出现多少次。 

考虑输入：```
aaaa
```正确的不同字符数是`1`， 不是`4`。 自从`1`是奇数，正确的输出是：```
IGNORE HIM!
```简单地检查总字符串长度的粗心实现会错误地打印`"CHAT WITH HER!"`。 

另一个容易犯的错误是忘记字符串中相距较远的重复字符。 

例如：```
abac
```不同的字母是`a`,`b`， 和`c`，所以计数是`3`。 正确的输出是：```
IGNORE HIM!
```如果我们只比较相邻的字符，我们会错误地计算`a`两次。 

单字符用户名还有一种边界情况：```
z
```恰好有一个不同的字符，所以答案是：```
IGNORE HIM!
```这会检查实现是否正确处理最小的有效输入。 

## 方法

 最直接的暴力方法是检查每个字符并手动检查我们以前是否见过它。 对于每个位置，我们扫描所有先前的位置以确定该角色是否是新的。 

对于一个长度的字符串`n`，这大致执行：```
1 + 2 + 3 + ... + n = O(n²)
```最坏情况下的比较。 

和`n ≤ 100`，这仍然是完全可以接受的。 即使是 10,000 次操作也可以忽略不计。 

暴力破解的想法之所以有效，是因为字母表很小并且输入大小也很小。 尽管如此，还是有更清晰的观察结果。 我们实际上并不关心字符的顺序或其频率。 我们只关心一组唯一的字母。 

Python已经提供了一个内置的`set`自动仅存储不同元素的结构。 将字符串转换为集合会立即删除重复项。 

例如：```
set("wjmzbmr")
```变成：```
{'w', 'j', 'm', 'z', 'b', 'r'}
```该集合的大小正是不同字符的数量。 一旦我们知道了这个计数，我们只需检查它是偶数还是奇数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 从输入中读取用户名字符串。 
2. 将字符串转换为集合。 

集合会自动删除重复的字符，只留下不同的字母。 
3. 计算集合的大小。 

这给出了用户名中唯一字符的数量。 
4. 检查该计数是偶数还是奇数。 

如果计数为偶数，则打印`"CHAT WITH HER!"`。 

否则，打印`"IGNORE HIM!"`。 

### 为什么它有效

 该算法依赖于集合最多包含每个值一次的属性。 将用户名转换为集合后，每个重复出现的字符都会自动消失。 因此，该集合的大小恰好等于用户名中不同字符的数量。 

问题的规则仅取决于该计数的奇偶性。 检查`count % 2`正确确定不同字符的数量是偶数还是奇数，因此算法始终会产生所需的输出。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()

distinct_count = len(set(s))

if distinct_count % 2 == 0:
    print("CHAT WITH HER!")
else:
    print("IGNORE HIM!")
```第一行读取用户名并使用删除尾随换行符`strip()`。 

表达式`set(s)`创建一个仅包含字符串中唯一字符的集合。 呼唤`len()`在这个集合上给出不同字母的数量。 

最终条件检查该计数的奇偶校验。 如果除以后的余数`2`为零，计数为偶数，我们打印`"CHAT WITH HER!"`。 否则，我们打印`"IGNORE HIM!"`。 

一个微妙的实现细节是使用`strip()`。 没有它，换行符`\n`输入可能会意外地成为集合的一部分，从而将不同字符数增加一并产生错误的答案。 

## 工作示例

 ### 示例 1

 输入：```
wjmzbmr
```| 步骤| 当前角色 | 鲜明的人物 |
 | --- | --- | --- |
 | 1 | 瓦 | {w} |
 | 2 | j | {w，j} |
 | 3 | 米 | {w，j，m} |
 | 4 | z | {w，j，m，z} |
 | 5 | 乙| {w、j、m、z、b} |
 | 6 | 米 | {w、j、m、z、b} |
 | 7 | r | {w、j、m、z、b、r} |

 最终套装包含 6 个不同的角色。 由于 6 是偶数，因此输出为：```
CHAT WITH HER!
```此示例演示了重复的字符，例如`m`只计算一次。 

### 示例 2

 输入：```
xiaodao
```| 步骤| 当前角色 | 鲜明的人物 |
 | --- | --- | --- |
 | 1 | x| {x} |
 | 2 | 我| {x, i} |
 | 3 | 一个 | {x, i, a} |
 | 4 | 哦| {x, i, a, o} |
 | 5 | d | {x, i, a, o, d} |
 | 6 | 一个 | {x, i, a, o, d} |
 | 7 | 哦| {x, i, a, o, d} |

 最终套装包含 5 个不同的角色。 由于 5 是奇数，因此输出为：```
IGNORE HIM!
```该跟踪证实多个重复字母不会影响不同计数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符都会插入到集合中一次 |
 | 空间| O(n) | 该集合可以存储所有不同的字符 |

 用户名的最大长度仅为 100，因此该解决方案可以轻松满足时间和内存限制。 即使较慢的二次方法也可以通过，但基于集合的解决方案既干净又更具可扩展性。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    s = input().strip()

    if len(set(s)) % 2 == 0:
        print("CHAT WITH HER!")
    else:
        print("IGNORE HIM!")

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
assert run("wjmzbmr\n") == "CHAT WITH HER!", "sample 1"

# custom cases
assert run("a\n") == "IGNORE HIM!", "single character"
assert run("aaaa\n") == "IGNORE HIM!", "all characters equal"
assert run("ab\n") == "CHAT WITH HER!", "small even distinct count"
assert run("abcdefghijklmnopqrstuvwxyz\n") == "CHAT WITH HER!", "maximum distinct letters"
assert run("abac\n") == "IGNORE HIM!", "non-adjacent duplicate characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`IGNORE HIM!`| 最小尺寸输入 |
 |`aaaa`|`IGNORE HIM!`| 重复字符算一次 |
 |`ab`|`CHAT WITH HER!`| 小甚至不同计数 |
 |`abcdefghijklmnopqrstuvwxyz`|`CHAT WITH HER!`| 最大可能的不同字母 |
 |`abac`|`IGNORE HIM!`| 重复的字母相距很远 |

 ## 边缘情况

 一个常见的错误是将字符串长度与不同字符的数量混淆。 

考虑：```
aaaa
```该算法将字符串转换为：```
{'a'}
```不同计数是`1`，这是奇数，因此输出变为：```
IGNORE HIM!
```这正确地忽略了相同字符的重复出现。 

另一个棘手的情况是重复的字母被分开。 

输入：```
abac
```该集合演变为：```
{'a'}
{'a', 'b'}
{'a', 'b'}
{'a', 'b', 'c'}
```最终计数为`3`，所以输出是：```
IGNORE HIM!
```这证实了该算法跟踪全局的唯一性，而不仅仅是相邻字符之间的唯一性。 

最小的有效输入也能正常工作。 

输入：```
z
```该集合变为：```
{'z'}
```计数是`1`，这是奇怪的，所以算法打印：```
IGNORE HIM!
```这验证了边界大小输入的正确处理。
