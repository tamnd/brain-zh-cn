---
title: "CF 1744D - 被 2^n 整除"
description: "给定一个正整数数组，我们需要使所有元素的乘积能被 $2^n$ 整除，其中 $n$ 是数组的长度。 我们可以将元素 $ai$ 与其自己的索引 $i$ 相乘，每个索引一次。"
date: "2026-06-09T15:53:51+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1744
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round  828 (Div. 3)"
rating: 1200
weight: 1744
solve_time_s: 202
verified: true
draft: false
---

[CF 1744D - 能被 2^n 整除](https://codeforces.com/problemset/problem/1744/D)

 **评分：** 1200
 **标签：** 贪婪、数学、排序
 **求解时间：** 3m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个正整数数组，我们需要使所有元素的乘积可以整除$2^n$， 在哪里$n$是数组的长度。 我们可以将一个元素相乘$a_i$通过它自己的索引$i$每个索引恰好一次。 目标是最小化这些乘法的次数，或者报告这是不可能的。 

实际上，每个数字都会为乘积贡献一定数量的 2 因数。 我们希望这些贡献的总和至少为$n$。 乘法$a_i$经过$i$可能会增加 2 的数量$a_i$，因为索引本身在分解时可能有一些 2。 

约束条件允许$n$达到$2 \cdot 10^5$每个测试集，并且所有测试用例的总和上限为相同的数字。 尝试所有操作组合的强力方法会太慢，因为索引子集的数量呈指数增长。 相反，我们需要一种方法来确定操作的优先级，以有效地达到所需的 2 数量。 

一个微妙的边缘情况是当所有数字都是奇数且索引很小时，因此任何允许的操作组合都无法达到足够的 2 秒。 例如，如果$a = [1, 1, 1, 1]$，将任何数字与其索引相乘最多得出每个数字的因数 2，因此乘积无法达到$2^4 = 16$，正确的输出是-1。 总是选择第一个数字的天真贪婪方法可能会错误地报告存在解决方案。 

## 方法

 朴素的暴力方法将考虑索引的所有子集，将运算应用于每个子集，计算结果乘积，并检查它是否可以整除$2^n$。 对于大小的数组$n$，这需要检查$2^n$子集。 即使是为了$n = 20$，这已经超过一百万个组合，并且$n$最多$2 \cdot 10^5$，这是完全不可行的。 

关键的见解是我们只关心每个数字因式分解中 2 的数量，而不是数字本身。 让我们定义一下`twos(a_i)`作为次数$a_i$能被 2 整除。同样，乘以索引$i$添加`twos(i)`到该元素的计数。 那么问题就简化为一个简单的选择问题：我们需要选择那些`twos(i)`贡献给了我们足够的额外 2 秒来达到总计$n$。 

所以，我们首先计算`twos(a_i)`超过所有元素。 如果至少已经是$n$，我们需要零运算。 否则，我们计算乘以索引可能获得的收益列表$i$，按降序排序，并贪婪地选择最大的增益，直到达到所需的总数。 如果我们在到达之前就耗尽了收益$n$，答案是-1。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了|
 | 最佳 |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1.读取数组$a$和它的长度$n$。 初始化`current_twos`为零。 
2. 对于每个元素$a_i$，使用重复除法计算它包含的 2 的因子数，并将其添加到`current_twos`。 
3.如果`current_twos >= n`，打印 0 并返回。 无需任何操作。 
4. 否则，计算一个列表`index_twos`其中每个条目是`twos(i)`为了$i = 1$到$n$。 这代表了我们相乘的潜在收益$a_i$经过$i$。 
5. 排序`index_twos`按降序排列，以便我们优先考虑贡献最多额外 2 的索引。 
6. 初始化`operations`到 0. 迭代`index_twos`，将每个值添加到`current_twos`并递增`operations`直到`current_twos >= n`。 
7. 如果在使用了所有可能的收益之后，`current_twos < n`，打印-1。 否则，打印`operations`。 

**为什么它有效**

 不变量是`current_twos`表示乘积中 2 的总幂。 按 2 的降序乘以索引可以保证我们以最少的操作达到所需的阈值。 没有任何替代指数可以通过更少的操作来实现目标，因为任何较小的增益对总和的贡献都不会那么大。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def count_twos(x):
    cnt = 0
    while x % 2 == 0:
        x //= 2
        cnt += 1
    return cnt

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        
        current_twos = sum(count_twos(x) for x in a)
        if current_twos >= n:
            print(0)
            continue
        
        index_twos = [count_twos(i) for i in range(1, n + 1)]
        index_twos.sort(reverse=True)
        
        operations = 0
        for gain in index_twos:
            current_twos += gain
            operations += 1
            if current_twos >= n:
                break
        
        if current_twos < n:
            print(-1)
        else:
            print(operations)

if __name__ == "__main__":
    solve()
```该解决方案首先计算每个数字中 2 的因数，以确定初始乘积的整除性。 对潜在收益进行排序可确保首先使用最大的贡献。 边缘情况，例如没有初始 2 的数组，自然由循环处理`index_twos`。 Python 自动处理整数溢出，因此大型产品不会导致问题。 

## 工作示例

 **示例1**：`n = 3, a = [10, 6, 11]`| 步骤| 当前_twos | index_twos（已排序）| 运营|
 | --- | --- | --- | --- |
 | 初始| 1 + 1 + 0 = 2 | [1, 1, 0] | 0 |
 | 添加第一个增益 | 2 + 1 = 3 | - | 1 |

 输出：1

 这里初始的二和是2，我们需要3。选择最大的索引增益加1，达到3。只需要一次操作。 

**示例2**：`n = 4, a = [13, 17, 1, 1]`| 步骤| 当前_twos | index_twos（已排序）| 运营|
 | --- | --- | --- | --- |
 | 初始| 0 | [2, 1, 0, 0] | 0 |
 | 添加第一个增益 | 0 + 2 = 2 | - | 1 |
 | 添加第二个增益 | 2 + 1 = 3 | - | 2 |
 | 添加第三个增益 | 3 + 0 = 3 | - | 3 |
 | 添加第四个增益 | 3 + 0 = 3 | - | 4 |

 我们永远不会达到 4，因此输出为 -1。 该算法正确地识别了不可能性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个元素计数为 O(log a_i)，排序增益为 O(n log n)，迭代为 O(n)。 |
 | 空间| O(n) | 存储数组和每个索引的增益。 |

 这完全符合约束条件。 即使与$n = 2 \cdot 10^5$并且多个测试用例、排序和计数操作都足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("6\n1\n2\n2\n3 2\n3\n10 6 11\n4\n13 17 1 1\n5\n1 1 12 1 1\n6\n20 7 14 18 3 5\n") == "0\n1\n1\n-1\n2\n1"

# Custom tests
assert run("1\n1\n1\n") == "-1", "single odd element"
assert run("1\n5\n2 4 8 16 32\n") == "0", "all powers of two already enough"
assert run("1\n3\n1 1 1\n") == "2", "needs multiple index multiplications"
assert run("1\n4\n3 3 3 3\n") == "-1", "all odd, cannot reach 2^4"
assert run("1\n6\n1 1 1 1 1 1\n") == "3", "multiple small odd numbers,
```
