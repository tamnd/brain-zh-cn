---
title: "CF 1397A - 字母杂耍"
description: "我们给定了一组字符串，我们可以在任何字符串之间自由移动字符，包括将字符从字符串移回自身。 目标是确定是否可以重新排列所有字符以使每个字符串最终都相同。"
date: "2026-06-11T09:19:22+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1397
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 666 (Div. 2)"
rating: 800
weight: 1397
solve_time_s: 105
verified: true
draft: false
---

[CF 1397A - 杂耍字母](https://codeforces.com/problemset/problem/1397/A)

 **评分：** 800
 **标签：** 贪心，字符串
 **求解时间：** 1m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定了一组字符串，我们可以在任何字符串之间自由移动字符，包括将字符从字符串移回自身。 目标是确定是否可以重新排列所有字符以使每个字符串最终都相同。 

输入由多个测试用例组成。 每个测试用例指定字符串的数量和字符串本身。 输出是简单的“是”或“否”，具体取决于是否可以重新排列。 

限制条件适中。 每个测试用例最多可以有 1000 个字符串，每个字符串的长度最多为 1000 个字符，但所有测试用例的所有字符总和上限为 1000。这意味着我们可以提供与字符总数线性相关的算法，而不是每个字符串或每个测试用例的算法。 

当字符分布不均匀时，就会出现一个重要的微妙之处。 例如，如果我们有三个字符串“a”、“a”和“b”，则“a”的总计数为 2，“b”的总计数为 1。无法生成三个相同的字符串，因为每个字符串最终必须具有相同的每个字母计数。 粗心的实现可能只检查所有字符串是否包含相同的字符集，而不考虑频率，在这种情况下会产生错误的“YES”。 

## 方法

 暴力方法是模拟在字符串之间移动字符，直到它们全部匹配。 例如，可以尝试通过重复移动字符来转换每个字符串以匹配第一个字符串。 这在理论上是正确的，但不可行：单独移动每个字符可能需要每个字符串每个字符多达 1000 次移动，导致最坏情况下的操作计数达到一百万或更多，考虑到问题的限制，这是不必要的。 

关键的见解是认识到字符的顺序并不重要。 任何字符都可以插入到任何字符串中的任何位置。 这减少了检查所有字符串中每个字符总数的问题。 对于有效的解决方案，每个字符的总数必须能除以字符串的数量。 如果不是，则不可能将该字符均匀地分配给所有字符串，因此不可能使所有字符串相同。 

这将一个潜在复杂的模拟问题转化为一个简单的计数问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(总字符数 * n) | O(总字符数) | 太慢了 |
 | 最佳 | O(总字符数) | O(26) | 已接受 |

 ## 算法演练

 1. 为字母表中的每个字母初始化一个计数器，表示当前测试用例中所有字符串中该字母的总数。 这是使用大小为 26 的数组完成的，该数组由字母“a”到“z”索引。 
2. 迭代每个字符串。 对于字符串中的每个字符，递增相应的计数器。 在此迭代结束时，计数器保存所有字符串中每个字符的总出现次数。 
3. 检查每个计数器值。 如果每个计数器都可以被字符串数量整除`n`，可以均匀地重新分配字符，因此打印“YES”。 如果任何计数器不能被整除`n`，立即打印“NO”。 这是有效的，因为可分性确保每个字符串可以接收完全相同的每个字符数。 

为什么它有效：不变的是重新分配字符不受限制； 因此，平等的唯一要求是每个字符串接收每个字母的相同份额。 如果总计数可被字符串数量整除，则存在有效的重新分配； 否则，它不会。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    counts = [0] * 26  # total counts of 'a' to 'z'
    
    for _ in range(n):
        s = input().strip()
        for ch in s:
            counts[ord(ch) - ord('a')] += 1
    
    possible = all(count % n == 0 for count in counts)
    print("YES" if possible else "NO")
```该解决方案读取测试用例的数量并独立处理每个测试用例。 对于每个测试用例，它都会计算每个字母的出现次数。 使用模运算符可确保每个字符可以均匀分布。 选择大小为 26 的数组是安全且高效的，避免了字典的开销。 剥离输入对于删除尾随换行符是必要的。 

## 工作示例

 ### 示例 1

 输入字符串：“caa”、“cbb”

 | 信| 总数 | 能被2整除吗？ |
 | ---| ---| ---|
 | 一个 | 2 | 是的 |
 | 乙| 2 | 是的 |
 | c | 2 | 是的 |

 所有计数均可被 2 整除，输出：YES。 可以重新排列两个字符串中的字符以形成“cab”。 

### 示例 2

 输入字符串：“cba”、“cba”、“cbb”

 | 信| 总数 | 能被3整除吗？ |
 | ---| ---| ---|
 | 一个 | 2 | 没有 |
 | 乙| 4 | 没有 |
 | c | 3 | 是的 |

 有些计数不能被 3 整除，输出：NO。 

这证实了算法正确地识别了何时由于不可分割的字符计数而无法进行重新分配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(总字符数) | 我们在每个测试用例中对所有字符精确地迭代一次 |
 | 空间| O(26) | 用于计算字母的固定大小数组 |

 考虑到所有字符串长度的总和≤ 1000，这在时间限制内运行得很好。 空间是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    t = int(input())
    for _ in range(t):
        n = int(input())
        counts = [0] * 26
        for _ in range(n):
            s = input().strip()
            for ch in s:
                counts[ord(ch) - ord('a')] += 1
        possible = all(count % n == 0 for count in counts)
        print("YES" if possible else "NO")
    return output.getvalue().strip()

# Provided samples
assert run("4\n2\ncaa\ncbb\n3\ncba\ncba\ncbb\n4\nccab\ncbac\nbca\nacbcc\n4\nacb\ncaf\nc\ncbafc\n") == "YES\nNO\nYES\nNO"

# Custom test cases
assert run("1\n1\na") == "YES", "single string, always YES"
assert run("1\n2\na\na") == "YES", "already equal strings"
assert run("1\n3\na\nb\nc") == "NO", "distinct single characters cannot be equal"
assert run("1\n3\naaa\naaa\naaa") == "YES", "all equal large strings"
assert run("1\n2\nabc\ndef") == "NO", "cannot redistribute to make equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 字符串“a”| 是 | 最小输入案例|
 | 2 个字符串 "a", "a" | 是 | 已经相等的字符串 |
 | 3 个字符串“a”、“b”、“c”| 否 | 单个字符不可重新分发 |
 | 3 个字符串“aaa”、“aaa”、“aaa”| 是 | 所有具有多个字母的相等字符串 |
 | 2 个字符串“abc”、“def”| 否 | 没有常用字母，不可能 |

 ## 边缘情况

 具有一个字符串的情况始终输出 YES。 如果字母的总字符数可以被字符串数整除，则该算法可以正确处理不同长度的字符串。 例如，“abc”、“a”给出计数 a=2、b=1、c=1。 当n=2时，b和c不能被2整除，输出：NO。 这证实了该算法正确地考虑了字符分布和字符串数量。
