---
title: "CF 1914A - 问题解决日志"
description: "Monocarp 的竞赛日志是一个长度为 $n$ 的字符串，其中第 $i$ 个字符代表他在 $i$ 分钟内正在处理的问题。 从“A”到“Z”的每个问题都有一个相关的所需解决时间：“A”需要 1 分钟，“B”需要 2 分钟，直到“Z”需要 26 分钟。"
date: "2026-06-08T20:01:26+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1914
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 916 (Div. 3)"
rating: 800
weight: 1914
solve_time_s: 123
verified: true
draft: false
---

[CF 1914A - 问题解决日志](https://codeforces.com/problemset/problem/1914/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Monocarp的比赛日志是一串长度的字符串$n$哪里的$i$-th 字符代表他在这一分钟内正在处理的问题$i$。 从“A”到“Z”的每个问题都有一个相关的所需解决时间：“A”需要 1 分钟，“B”需要 2 分钟，直到“Z”需要 26 分钟。 如果 Monocarp 累计花费了至少所需的时间，则认为问题已经解决。 目标是计算到比赛结束时他解决了多少个不同的问题。 

输入由多个测试用例组成，每个测试用例都有竞赛持续时间和日志字符串。$n$最多可达 500 个，测试用例最多为 100 个，因此所有测试用例的总工作量最多为$5 \cdot 10^4$运营。 这使得解决方案能够在线性时间内处理每个测试用例的整个字符串。 多次针对整个字符串检查每个问题的简单方法会变得不必要的复杂，并且可能会引入错误。 边缘情况包括 Monocarp 重复处理一个问题但没有完成的日志，或者同一问题的多个解决方案的日志； 该算法必须在满足要求的时间后对每个问题最多计数一次。 

## 方法

 暴力方法将迭代每个测试用例的所有 26 个问题，并针对每个问题计算日志中与该问题相对应的分钟数。 如果计数达到或超过所需时间，则增加已解决的计数。 这个方法是正确的，但是需要$26 \cdot n$每个测试用例的操作。 在给定的约束下，这是可以接受的，但效率稍低，因为它多次重复相同的扫描。 

当我们遍历日志一次时，最佳方法利用每个问题的时间直接累积。 我们维护一个包含 26 个计数器的数组，对应于每个问题。 每分钟，我们都会增加日志指示的问题的计数器。 遍历结束后，我们检查哪些计数器满足或超过了相应问题所需的时间。 该方法处理每次登录$O(n)$时间和$O(1)$额外的空间，并且避免重复扫描。 关键的见解是，问题所需的时间严格由其字母索引决定，并且我们可以在不考虑顺序的情况下一次性累积时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(26 * n) | O(26 * n) | O(26) | 已接受 |
 | 最佳 | O(n) | O(26) | 已接受 |

 ## 算法演练

 1.初始化一个数组`times[26]`为零。 每个元素对应于问题“A”到“Z”，并将跟踪 Monocarp 在该问题上花费的累计分钟数。 
2. 对于每个角色`c`在比赛日志中，将其索引计算为`idx = ord(c) - ord('A')`并增加`times[idx]`一个。 这一步会累计比赛期间解决每个问题所花费的时间。 
3. 初始化计数器`solved = 0`。 
4. 迭代`i`从 0 到 25，代表问题“A”到“Z”。 对于每个问题，检查是否`times[i] >= i + 1`因为问题“A”需要 1 分钟，“B”需要 2 分钟，...，“Z”需要 26 分钟。 如果条件成立，则增加`solved`。 
5、输出`solved`作为 Monocarp 在此测试用例中解决的问题数量。 

该算法之所以有效，是因为每个问题所需的时间都是独立的，并且在日志中累积时间可以正确地计算出所花费的所有分钟数。 不变的是，处理完日志后，`times[i]`准确地表示 Monocarp 在问题上花费的总分钟数`chr(ord('A') + i)`。 检查对照`i + 1`正确判断问题是否得到解决。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    log = input().strip()
    times = [0] * 26
    for c in log:
        times[ord(c) - ord('A')] += 1
    solved = sum(1 for i in range(26) if times[i] >= i + 1)
    print(solved)
```我们独立处理每个测试用例。 数组`times`跟踪每个问题的时间，并使用 ASCII 算术将字母转换为索引。 最后对数组求和，检查哪些问题有足够的累积时间。 这样可以避免重复扫描，并通过每分钟精确计数一次来保证正确性。 

## 工作示例

 输入示例：```
6
ACBCBC
```| 分钟 | 日志| 次['A'..'C'] | 次['A'..'C'] | 说明|
 | --- | --- | --- | --- |
 | 1 | 一个 | [1,0,0]| “A”获得 1 分钟 |
 | 2 | C | [1,0,1]| “C”获得 1 分钟 |
 | 3 | 乙| [1,1,1]| “B”获得 1 分钟 |
 | 4 | C | [1,1,2]| 'C' 累计 2 |
 | 5 | 乙| [1,2,2]| 'B' 累计 2 |
 | 6 | C | [1,2,3]| 'C' 累计 3 |

 检查所需时间：“A”1 → 已解决，“B”2 → 已解决，“C”3 → 已解决。 解决总数 = 3。 

输入示例：```
7
AAAAFPC
```| 分钟 | 日志| 次['A'..'F','P','C'] | 次['A'..'F','P','C'] 说明|
 | --- | --- | --- | --- |
 | 1-4 | 1-4 一个 | 4 | 'A' 累计 4 |
 | 5 | F | 1 | 'F' 累计 1 |
 | 6 | 普 | 1 | 'P' 累计 1 |
 | 7 | C | 1 | 'C' 累计 1 |

 所需次数：'A' 1 → 已解决，'C' 3 → 未解决，'F' 6 → 未解决，'P' 16 → 未解决。 解决总数 = 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个日志字符被处理一次，数组总和为 O(26) |
 | 空间| O(26) | 大批`times`保存每个问题的累积分钟数 |

 所有测试用例的总操作最多为 500 * 100 = 50,000 次，完全在 2 秒的时间限制内。 由于数组大小固定，内存使用量最小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        log = input().strip()
        times = [0]*26
        for c in log:
            times[ord(c)-ord('A')] += 1
        solved = sum(1 for i in range(26) if times[i] >= i+1)
        print(solved)
    return output.getvalue().strip()

# Provided samples
assert run("3\n6\nACBCBC\n7\nAAAAFPC\n22\nFEADBBDFFEDFFFDHHHADCC\n") == "3\n1\n4"

# Custom cases
assert run("1\n1\nA\n") == "1", "single minute, single problem solved"
assert run("1\n26\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n") == "1", "all problems touched once, only A solved"
assert run("1\n52\nABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ\n") == "2", "all problems twice, only A and B solved"
assert run("1\n500\n" + "A"*500 + "\n") == "1", "large input, all time on A"
assert run("1\n26\nZ"*26 + "\n") == "0", "all time on hardest problem, not solved"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 1 | 单分钟日志，最简单的情况 |
 | 一次 26 个字母 | 1 | 只有“A”符合要求 |
 | 2×26 个字母 | 2 | 多次出现的累积 |
 | 500×A | 1 | 大输入，检查性能|
 | 26×Z | 0 | 时间不够，难题未解决|

 ## 边缘情况

 如果 Monocarp 在一个问题上重复花费几分钟而没有达到所需的阈值，则算法会正确报告零。 例如，问题“F”花费 5 分钟（需要 6 分钟）会导致`times[5] = 5 < 6`，所以不计算在内。 如果同一问题出现多次求解，累加会正确计算总时间，而不会重复计算，即使对于长重复序列也能确保正确性。
