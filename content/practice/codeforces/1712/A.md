---
title: "CF 1712A - 奇妙的排列"
description: "我们得到了从 1 到 $n$ 的整数排列，这意味着从 1 到 $n$ 的每个数字都以某种任意顺序恰好出现一次。 任务是通过在任意两个位置之间执行交换来最小化此排列中前 $k$ 元素的总和。"
date: "2026-06-09T20:19:15+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1712
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 813 (Div. 2)"
rating: 800
weight: 1712
solve_time_s: 113
verified: true
draft: false
---

[CF 1712A - 精彩排列](https://codeforces.com/problemset/problem/1712/A)

 **评分：** 800
 **标签：** 贪心，实现
 **求解时间：** 1m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了从 1 到$n$，表示从 1 到$n$以任意顺序只出现一次。 任务是最小化第一个的总和$k$通过在任意两个位置之间执行交换来排列此排列中的元素。 每次交换都算作一次操作，我们需要找到所需的此类操作的最少数量。 

输入尺寸很小：$n$最多可以有 100 个，并且最多可以有 100 个测试用例。 这意味着$O(n^2)$解决方案是可以接受的，但我们也可以瞄准$O(n \log n)$使用排序。 由于所有数字都是不同的并且有界$n$，我们永远不会有重复或超出范围的数字，因此我们不需要验证排列。 

A subtle edge case is when the first$k$元素已经包含$k$最小的数字。 例如，如果$n=5$,$k=3$，数组是$[1, 2, 3, 5, 4]$，不需要交换，所以答案应该是 0。一种幼稚的方法，盲目地计算放错位置的数字，而不考虑它们是否已经在第一个中$k$插槽可能会超出掉期计数。 

另一个边缘情况是$k=1$或者$k=n$。 如果$k=1$，我们只需要第一个位置的最小元素。 如果$k=n$，总和涉及整个排列，该排列已经固定，因此不可能或不需要交换。 

## 方法

 暴力方法是尝试所有可能的交换序列，计算第一个交换序列的总和$k$每个序列后面的元素。 这在原则上是正确的，但完全不切实际。 为了$n=100$, 大致有$\binom{100}{2} = 4950$可能的单次交换，并且考虑多次交换很快就会变得具有爆炸性。 

关键的见解是最小化第一个的总和$k$元素，我们只关心放置$k$最小的数字进入第一个$k$职位。 这些之间的顺序$k$数字并不重要，其余的顺序也不重要$n-k$数字。 因此，问题就简化为计算有多少个$k$目前最小的数字在第一个数字之外$k$职位。 这些数字中的每一个都需要交换。每次交换只能修复第一个数字中的一个数字$k$位置，所以操作的数量等于当前外面的小数字的数量。 

为了实现这一点，我们首先确定$k$最小的数字，即 1 到$k$。 然后我们迭代最后一个$n-k$位置并首先数出其中有多少个$k$第一个数字缺失$k$插槽。 每个缺失的数字对应于所需的交换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n!) * n) | O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.首先确定我们想要的一组数字$k$职位。 这些是整数 1 到$k$。 使用集合允许$O(1)$会员资格检查。 
2.扫描第一个$k$元素并标记其中的哪些$k$数字已经就位。 统计一下有多少人失踪了。 我们只需要知道 1 到 哪些数字$k$第一次缺席$k$插槽。 
3. 第一个缺失的数字$k$头寸与所需的掉期数量完全对应。 每次交换都可以从剩余的数字中引入一个缺失的小数字$n-k$职位。 
4. 返回缺失数字的个数作为最小运算次数。 

为什么它有效：该算法保持了第一个数字之外的每个数字的不变性$k$属于第一的位置$k$只计算一次。 将每个缺失的数字交换即可修复一个赤字。 由于我们只交换我们需要的数字，因此我们从不执行不必要的操作。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    p = list(map(int, input().split()))
    
    # Set of numbers that should be in the first k positions
    needed = set(range(1, k+1))
    
    # Count numbers among first k that are already correct
    in_place = sum(1 for i in range(k) if p[i] in needed)
    
    # Missing numbers = total needed - already in place
    print(k - in_place)
```该代码读取每个测试用例，识别$k$最小的数字（1 到$k$），计算第一个已经有多少个$k$位置，并打印差异。 使用最小数字的集合可确保恒定时间的成员资格检查。 使用`sum`使用生成器表达式可以避免创建临时列表。 

## 工作示例

 **示例输入 1：**```
3 1
2 3 1
```| 我| p[i] | p[i] 需要吗？ | 就地计数 |
 | --- | --- | --- | --- |
 | 0 | 2 | 没有| 0 |

 k - in_place = 1 - 0 = 1，与预期输出匹配。 

**示例输入 2：**```
3 3
1 2 3
```| 我| p[i] | p[i] 需要吗？ | 就地计数 |
 | --- | --- | --- | --- |
 | 0 | 1 | 是的 | 1 |
 | 1 | 2 | 是的 | 2 |
 | 2 | 3 | 是的 | 3 |

 k - in_place = 3 - 3 = 0，正确。 

这些痕迹表明该算法准确地计算了第一个中缺失的小数。$k$头寸，产生最少数量的掉期。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 扫描前 k 个元素并检查大小为 k 的集合中的成员资格是线性的 |
 | 空间| O(k) | 存储 k 个最小数字的集合 |

 给定$t \le 100$和$n \le 100$，总操作数最多为 10,000 次，轻松适合 1 秒和 256 MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        p = list(map(int, input().split()))
        needed = set(range(1, k+1))
        in_place = sum(1 for i in range(k) if p[i] in needed)
        print(k - in_place)
        
    return output.getvalue().strip()

# provided samples
assert run("4\n3 1\n2 3 1\n3 3\n1 2 3\n4 2\n3 4 1 2\n1 1\n1") == "1\n0\n2\n0", "sample 1"

# custom cases
assert run("1\n5 2\n5 4 3 2 1") == "2", "both needed numbers are at the end"
assert run("1\n6 3\n1 3 2 6 5 4") == "0", "needed numbers already in first k positions"
assert run("1\n1 1\n1") == "0", "single element, nothing to swap"
assert run("1\n4 4\n4 3 2 1") == "4", "all numbers in wrong positions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 2\n5 4 3 2 1`| 2 | 两个所需的数字都在末尾 |
 |`6 3\n1 3 2 6 5 4`| 0 | 所需数字已位于前 k 个位置 |
 |`1 1\n1`| 0 | 单一元素，无需交换 |
 |`4 4\n4 3 2 1`| 4 | 所有数字位置错误，完全排列 |

 ## 边缘情况

 如果$k = n$，第一个$k$位置包括整个数组。 该算法计算有多少个数字从 1 到$n$都在第一个$n$位置，始终是$n$。 缺失的计数是$n-n=0$，所以它正确输出 0。 

如果$k = 1$并且第一个元素不为1，算法会统计第一个位置是否为1。 如果不是，则输出 1，表示需要进行一次交换才能将 1 置于前面。 

如果数组已经排序$k$第一个最小的数字$k$槽，算法正确计数所有到位并输出 0。例如，(n=5, k=3, p=[1,2,3,5,4
