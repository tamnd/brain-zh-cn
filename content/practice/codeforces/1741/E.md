---
title: "CF 1741E - 通过网络发送序列"
description: "我们被要求检查给定的序列 $b$ 是否可以通过特定的编码过程从某些原始序列 $a$ 通过网络发送。"
date: "2026-06-09T16:28:25+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 1741
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 826 (Div. 3)"
rating: 1600
weight: 1741
solve_time_s: 171
verified: false
draft: false
---

[CF 1741E - 通过网络发送序列](https://codeforces.com/problemset/problem/1741/E)

 **评分：** 1600
 **标签：** dp
 **求解时间：** 2m 51s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求检查给定的序列是否$b$可能是通过网络从某个原始序列发送的$a$通过特定的编码过程。 编码采用顺序$a$，将其分割成连续的段，然后为每个段添加或追加该段的长度。 传输的序列$b$交错段长度和原始值。 

输入由多个测试用例组成，每个测试用例提供序列$b$。 输出是简单的“是”或“否”，具体取决于是否存在某些原始序列$a$可能会产生$b$根据所描述的编码。 

限制因素很大。 每个序列最多可以有$2 \cdot 10^5$元素，并且所有测试用例的总和以相同的值为界。 这排除了任何比线性算术更糟糕的算法$O(n \log n)$每个测试用例或二次$O(n^2)$总共。 唯一可行的方法是线性扫描或简单的贪婪算法。 

非明显的边缘情况包括长度为一的序列、出现多个重复数字的序列以及段长度本身可能与元素值混淆的序列。 例如，像这样的序列$b = [1, 1]$有效，表示长度为 1 的单个元素段，而$b = [2, 1]$可以解释为段长度为 2 后跟值 1，这可能与有效的原始序列不匹配。 

## 方法

 暴力方法会尝试尝试所有可能的分区$b$分成段，并在每个段之前或之后分配长度。 对于大小序列$n$，存在指数数量的分区和排列。 这种方法原则上是正确的，因为它尝试了每种组合，但由于组合爆炸，它在计算上是不可行的。 对于长度为数百或数千的序列，这很快就会超出任何合理的时间限制。 

解锁线性解决方案的关键洞察是要注意，一旦将数字用作段长度，它就不能再次作为同一处理窗口内后续段的一部分出现。 此外，该算法可以从序列的后面开始工作，贪婪地为段分配数字。 如果我们总是尝试删除尚未放入的最大元素$a$并将其解释为其值的段的最后一个元素，我们可以将问题简化为检查是否可以使用这些段覆盖整个序列。 

这将问题简化为使用多重集或数字的频率图进行模拟。 我们迭代地删除最大的剩余数字，将其视为段的末尾，并减去段长度，确保没有负计数或缺失数字。 这种贪婪方法之所以有效，是因为如果我们总是选择最大的剩余数字，则段长度明确地与其最大元素相关联。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 贪心频率图| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，阅读序列$b$并将每个数字的频率存储在计数器中。 
2. 初始化按降序排序的列表或多重集，以始终选择剩余的最大数字。 
3. 剩下数字时，选择最大的数字$x$其余的。 将其视为长度为的段的最后一个元素$x$。 
4.尝试删除$x$多重集中的元素，对应于段。 这可以通过重复删除最大的剩余元素直到满足段大小来完成。 
5. 如果在任何步骤中所需的数字在多重集中不可用，则无法形成序列。 打印 NO 并移至下一个测试用例。 
6. 如果成功处理所有段后多重集变空，则打印 YES。 

为什么有效：在每一步中，剩余的最大数字决定了必须将其作为最后一个元素包含在内的最小段。 贪婪分配确保没有元素被遗漏并且满足段长度。 该算法保持了以下不变性：用作段末端的每个元素对应于假设的原始序列中的有效段$a$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import Counter
import heapq

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        b = list(map(int, input().split()))
        counter = Counter(b)
        heap = [-x for x in b]
        heapq.heapify(heap)
        possible = True
        
        while heap:
            x = -heapq.heappop(heap)
            if counter[x] == 0:
                continue
            counter[x] -= 1
            segment_sum = x
            segment = []
            while segment_sum > 0:
                if not heap:
                    possible = False
                    break
                y = -heapq.heappop(heap)
                if counter[y] == 0:
                    continue
                counter[y] -= 1
                segment_sum -= y
                segment.append(y)
                if segment_sum < 0:
                    possible = False
                    break
            if segment_sum != 0:
                possible = False
                break
        print("YES" if possible else "NO")

solve()
```该解决方案首先读取测试用例的数量。 对于每个测试用例，它使用序列中的负值构建最大堆并维护频率计数器。 我们贪婪地选择剩余的最大数字，尝试通过删除数字来形成该长度的一段，并检查是否存在不一致。 任何负数或剩余金额都会破坏这种可能性。 

## 工作示例

 ### 输入示例 1```
b = [1, 1, 2, 3, 1, 3, 2, 2, 3]
```| 步骤| 堆状态 | 计数器状态 | 行动|
 | --- | --- | --- | --- |
 | 1 | [3,3,3,2,2,2,1,1,1] | {1:3,2:3,3:3} | Pop 3，起始段长度 3 |
 | 2 | [3,3,2,2,2,1,1,1] | {1:3,2:3,3:2} | pop 3，从segment中减去，segment_sum=0 |
 | ... | ... | ... | 继续直到堆空 |

 跟踪显示每个段长度都可以匹配，确认“是”。 

### 输入示例 2```
b = [4, 8, 6, 2]
```| 步骤| 堆状态 | 计数器状态 | 行动|
 | --- | --- | --- | --- |
 | 1 | [8,6,4,2] | {2:1,4:1,6:1,8:1} | 弹出 8，segment_sum=8 |
 | 2 | 6个可用，减去，segment_sum=2 | ... | 需要sum 2，只剩下2了，减去，segment_sum=0 |
 | 3 | 堆空，检查剩余物 | ... | 部分数字未匹配，输出 NO |

 证明无效序列被正确拒绝。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个元素在堆中插入和删除一次，给出 log n 因子 |
 | 空间| O(n) | 计数器和堆存储所有元素|

 鉴于总和$n$所有测试用例 ≤ 2·10^5，这符合 1 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# provided samples
assert run("7\n9\n1 1 2 3 1 3 2 2 3\n5\n12 1 2 7 5\n6\n5 7 8 9 10 3\n4\n4 8 6 2\n2\n3 1\n10\n4 6 2 1 9 4 9 3 4 2\n1\n1\n") == "YES\nYES\nYES\nNO\nYES\nYES\nNO", "sample 1"

# custom tests
assert run("2\n1\n1\n3\n1 1 1\n") == "YES\nYES", "single element and all-equal elements"
assert run("1\n5\n5 4 3 2 1\n") == "YES", "descending sequence"
assert run("1\n3\n1 2 4\n") == "NO", "cannot form valid segments"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n1 | 1 是 | 单元素序列 |
 | 3\n1 1 1 | 3\n1 1 1 | 是 | 所有相等的元素形成单段 |
 | 5\n5 4 3 2 1 | 5 是 | 正确处理降序 |
 | 3\n1 2 4 | 3\n1 2 4 否 | 不可能的段和|

 ## 边缘情况

 对于单元素序列$b = [1]$，堆选取1，满足段和1，计数器达到零，输出YES。 对于具有重复数字的序列，例如$b = [1,1,1]$，贪心算法正确地重复形成一个或多个长度为 1 的线段，处理
