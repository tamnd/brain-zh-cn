---
title: "CF 1926A - 弗拉德和五人之战"
description: "任务很简单：对于每个长度为 5、仅包含字母 A 和 B 的字符串，确定哪个字母出现的频率更高。 每个测试用例都提供一个这样的字符串，并且我们有多个测试用例要处理。"
date: "2026-06-08T18:58:51+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1926
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 928 (Div. 4)"
rating: 800
weight: 1926
solve_time_s: 89
verified: true
draft: false
---

[CF 1926A - 弗拉德和五人之战](https://codeforces.com/problemset/problem/1926/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务很简单：对于每个长度为 5 且仅包含字母的字符串`A`和`B`，确定哪个字母出现频率更高。 每个测试用例都提供一个这样的字符串，并且我们有多个测试用例要处理。 输出只是字符`A`或者`B`对于每个字符串，代表最常见的字母。 

限制非常轻。 每个字符串的长度恰好为 5，测试用例的数量最多为 32。这意味着即使是检查每个字符串的每个字符的强力算法也非常快，因为最坏情况下的字符检查总数为 32 乘以 5，即 160 次操作。 不需要复杂的优化或数据结构。 内存使用量也可以忽略不计。 

当出现不明显的边缘情况时`A`和`B`出现相同次数。 在长度为 5 的字符串中，这种情况不可能发生，因为 5 是奇数。 因此，一个字母始终严格占主导地位。 字符串如`AAAAA`或者`BBBBB`表示极端情况，即相同的字符填充整个字符串。 另一种微妙的情况是当主要字母只出现一次时，例如`ABBBB`，其中计数逻辑不得误计数。 

## 方法

 最简单的方法是迭代每个字符串并计算出现的次数`A`和`B`使用一个简单的循环。 一旦知道两个计数，就比较它们并输出计数较高的字母。 这是可行的，因为字符串长度是恒定的并且非常小，因此每个字符串两个单独的计数器的成本可以忽略不计。 

稍微优雅的方法的关键在于 Python 字符串支持内置的`count`方法，所以我们可以直接调用`s.count('A')`和`s.count('B')`对于每个字符串。 最大长度为 5，所以`count`内部最多迭代五个字符。 这通过更清晰的代码给出了相同的结果。 无需进一步优化，因为算法已经针对每个测试用例以恒定时间运行。 

暴力破解和内置计数方法都以相对于字符串长度的线性时间运行，但实际操作次数非常少，因此在实践中它们本质上是等效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 手动计数循环| O(5 * t) = O(t) | O(1) | O(1) | 已接受 |
 | Python`count`方法| O(5 * t) = O(t) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 这告诉我们要处理多少个字符串。 
2. 循环每个测试用例，读取字符串`s`长度为五。 
3. 数一下数量`A`字符串中的字符使用`s.count('A')`。 将其存储在变量中`a_count`。 
4. 数一下数量`B`字符使用`s.count('B')`，或等效地计算为`5 - a_count`因为字符串长度是固定的。 
5. 比较`a_count`和`b_count`。 如果`a_count`越大，输出`A`; 否则输出`B`。 
6. 对所有测试用例重复此操作。 

为什么它有效：总和`A`和`B`计数始终等于五，因此一个计数足以推断另一个计数。 每个字符串都有一个唯一的多数字母，因为长度是奇数，因此第五步中的比较总是会产生正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = input().strip()
    a_count = s.count('A')
    b_count = 5 - a_count
    if a_count > b_count:
        print('A')
    else:
        print('B')
```该解决方案使用快速 I/O 读取所有输入行。 这`.strip()`调用删除所有尾随换行符。 计数`A`首先从五中减去得到`B`避免不必要的第二次调用`count`。 比较很简单，因为多数字母是由字符串长度保证的。 由于我们使用的是固定长度 5，因此不存在相差一的风险。 

## 工作示例

 **示例输入 1：**`ABABB`| 步骤|`s`|`a_count`|`b_count`| 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 阿巴布 | 2 | 3 | 乙|

 **示例输入 2：**`AAAAA`| 步骤|`s`|`a_count`|`b_count`| 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 啊啊啊| 5 | 0 | 一个 |

 这些痕迹表明该算法正确识别了字符串中的多数字符，其中`B`占主导地位以及在哪里`A`占主导地位。 计数逻辑很简单，固定长度可以防止出现歧义的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t) | 每个字符串的长度为五，因此每个字符串的计数操作是恒定的。 最多 32 个字符串，总时间最短。 |
 | 空间| O(1) | O(1) | 我们每个字符串仅存储两个计数器，并且没有额外的数据结构。 |

 考虑到这些限制，该解决方案的完成时间可以忽略不计，并且使用的内存也很少，完全在提供的限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        s = input().strip()
        a_count = s.count('A')
        b_count = 5 - a_count
        if a_count > b_count:
            output.append('A')
        else:
            output.append('B')
    return "\n".join(output)

# provided sample
assert run("8\nABABB\nABABA\nBBBAB\nAAAAA\nBBBBB\nBABAA\nAAAAB\nBAAAA\n") == "B\nA\nB\nA\nB\nA\nA\nA", "sample 1"

# custom cases
assert run("1\nBBBBB\n") == "B", "all B"
assert run("1\nAAAAA\n") == "A", "all A"
assert run("1\nABBBB\n") == "B", "one A, four B"
assert run("1\nAAABB\n") == "A", "three A, two B"
assert run("1\nBAAAA\n") == "A", "one B, four A"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | BBBB | 乙| 所有字符均相同，均为 B |
 | 啊啊啊| 一个 | 所有字符都相同，均为 A |
 | ABBBB| 乙| B 相对于 A 的小多数 |
 | AAABB | 一个 | A 相对于 B 的小多数 |
 | 巴阿阿| 一个 | 开始时为 B，多数为 A |

 ## 边缘情况

 对于所有字符都相同的字符串，例如`AAAAA`或者`BBBBB`，该算法对一个字母计数为 5，对另一个字母计数为零。 比较仍然有效并返回正确的字母。 对于只有一个少数字符的字符串，例如`ABBBB`或者`BAAAA`，计数仍然会产生正确的多数，因为固定的字符串长度保证了唯一的主导字符。 无需额外处理。
