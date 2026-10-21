---
title: "CF 1146A - 爱“A”
 描述："问题给了我们一个由小写字母组成的字符串，Alice 想要将其转换为一个“好的”字符串。 一个好的字符串是其中严格超过一半的字符是字母“a”的字符串。"
date: "2026-06-12T03:18:42+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1146
codeforces_index: "A"
codeforces_contest_name: "Forethought Future Cup - Elimination Round"
rating: 800
weight: 1146
solve_time_s: 87
verified: true
draft: false
---

[CF 1146A - 爱 \"A\](https://codeforces.com/problemset/problem/1146/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题给了我们一个由小写字母组成的字符串，Alice 想要将其转换为一个“好的”字符串。 一个好的字符串是其中严格超过一半的字符是字母“a”的字符串。 Alice 可以删除任意数量的字符，包括零个字符，但不能添加新字符。 目标是确定删除字符后她可以获得的好字符串的最大长度。 

鉴于字符串长度最多为 50，我们可以推断所有可能的删除，而不必担心暴力方法的性能。 然而，该问题具有隐藏的数学结构，可以提供简单直接的解决方案。 保证该字符串至少包含一个“a”，这确保始终可能有一个好的字符串。 边缘情况包括已经以“a”为主的字符串、在许多其他字母中仅包含一个“a”的字符串以及仅包含“a”的字符串。 

简单的实现可能会尝试生成所有字符子集，计算每个子集中的“a”，并检查子集是否满足多数条件。 这种方法适用于小字符串，但没有必要且过于复杂。 

例如，考虑输入`abbb`。 有一个“a”和其他三个字母。 为了使字符串良好，我们需要比非“a”更多的“a”。 如果我们保留所有四个字母，就会有一个“a”和三个非“a”，这不好。 删除两个 'b' 叶子`abb`有一个“a”和两个非“a”，仍然不好。 删除三个 'b' 叶子`a`，这很好。 所以答案是1。 

## 方法

 暴力方法的工作原理是考虑每个可能的字符子集，计算“a”和其他字母，并检查剩余字符中是否有一半以上是“a”。 这种方法是正确的，因为它探索了所有可能性，但在最坏的情况下其复杂度为 O(2^n)，即使对于 n=50，这也是不必要的。 

最佳方法来自观察删除非“a”字符会增加“a”的比例。 让`count_a`是 'a' 的数量并且`count_other`是非“a”字符的数量。 为了满足“好”条件，“a”的数量必须大于剩余的其他字符的数量。 如果我们删除足够多的非“a”字符`count_a > count_other_remaining`，我们通过保留所有“a”和足够的非“a”来最大化结果字符串的长度以满足严格多数。 

从数学上讲，如果我们保留所有 'a' 和`k`其他字母，条件`count_a > k`必须持有。 最大可能的 k 是`count_a - 1`自从保留`count_a`或更多其他字母将违反多数条件。 因此，一个好的字符串的最大长度是`count_a + min(count_other, count_a - 1)`。 这将问题简化为一次扫描计算“a”并从总长度中减去。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 统计字符串中'a的总数，并将其存储在`count_a`。 这标识了我们想要控制最终字符串的字符。 
2. 计算非“a”字符的总数：`count_other = len(s) - count_a`。 这些是要删除的候选者。 
3. 确定在保持字符串完好的情况下可以保留的非“a”字符的最大数量。 严格多数条件要求`count_a > count_other_remaining`，所以最大`count_other_remaining`是`count_a - 1`。 
4. 因此，生成的好字符串的最大长度为`count_a + min(count_other, count_a - 1)`。 如果非“a”字符少于`count_a - 1`，全部保留； 否则，只保留`count_a - 1`。 
5. 打印结果。 

为什么有效：该算法保证“a”的数量始终严格多于最终字符串中其他字母的数量。 这个不变量满足好字符串的定义，并通过在不违反严格多数的情况下保留尽可能多的其他字母来最大化长度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
count_a = s.count('a')
count_other = len(s) - count_a
# maximum number of non-'a's we can keep while keeping 'a's in strict majority
max_good_length = count_a + min(count_other, count_a - 1)
print(max_good_length)
```该代码首先计算“a”和非“a”的数量。 公式`count_a + min(count_other, count_a - 1)`确保最大的良好字符串长度。 使用`min`处理非“a”数量少于的情况`count_a - 1`，避免负长度。 剥离输入可以避免尾随换行问题。 

## 工作示例

 ### 示例 1：`xaxxxxa`| 步骤| 计数_a | count_other | 分钟（count_other，count_a-1）| 最大好长度|
 | ---| ---| ---| ---| ---|
 | 初始| 2 | 5 | 最小值(5,1)=1 | 2+1=3 |

 跟踪确认我们保留了两个“a”和一个非“a”，与预期输出 3 匹配。 

### 示例 2：`aa`| 步骤| 计数_a | 计数其他 | 分钟（count_other，count_a-1）| 最大好长度|
 | ---| ---| ---| ---| ---|
 | 初始| 2 | 0 | 最小值(0,1)=0 | 2+0=2 |

 所有字母都是“a”，所以字符串已经很好了。 该公式正确返回长度 2。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 计算 'a' 需要扫描字符串一次 |
 | 空间| O(1) | O(1) | 仅使用了少数整数变量 |

 考虑到最大字符串长度为 50，该算法的执行时间为微秒，并且使用的内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    s = input().strip()
    count_a = s.count('a')
    count_other = len(s) - count_a
    return str(count_a + min(count_other, count_a - 1))

# provided samples
assert run("xaxxxxa\n") == "3", "sample 1"
assert run("aa\n") == "2", "sample 2"

# custom cases
assert run("a\n") == "1", "single 'a'"
assert run("baba\n") == "3", "two 'a's, two other letters"
assert run("aaaaa\n") == "5", "all 'a's"
assert run("abbbbb\n") == "1", "one 'a', many non-'a's"
assert run("abcde\n") == "1", "one 'a', four others"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a`| 1 | 最小尺寸输入 |
 |`baba`| 3 | 正确删除非“a”以实现多数 |
 |`aaaaa`| 5 | 所有字母都是“a” |
 |`abbbbb`| 1 | 只有一个“a”占主导地位 |
 |`abcde`| 1 | 具有多个非“a”的边缘情况 |

 ## 边缘情况

 对于单个“a”，`s = "a"`,`count_a = 1`,`count_other = 0`。 公式给出`1 + min(0, 0) = 1`，这是正确的。 

为了`s = "abbbbb"`,`count_a = 1`,`count_other = 5`。 我们可以保留的最大非“a”是`count_a - 1 = 0`。 公式给出`1 + 0 = 1`。 删除除保留“a”之外的所有“b”可确保严格多数，这符合问题要求。 这表明该算法可以正确处理极端不平衡。
