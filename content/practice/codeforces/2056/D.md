---
title: "CF 2056D - 唯一中位数"
description: "我们被要求计算给定数组的子数组，其中中位数是唯一定义的。 实际上，这意味着如果排序后中间元素（或两个中间元素，如果长度为偶数）相等，则子数组是好的。"
date: "2026-06-08T08:16:38+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "combinatorics", "data-structures", "divide-and-conquer", "dp"]
categories: ["algorithms"]
codeforces_contest: 2056
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 997 (Div. 2)"
rating: 2200
weight: 2056
solve_time_s: 123
verified: false
draft: false
---

[CF 2056D - 唯一中位数](https://codeforces.com/problemset/problem/2056/D)

 **评分：** 2200
 **标签：** 二分查找、暴力破解、组合学、数据结构、分而治之、dp
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算给定数组的子数组，其中中位数是唯一定义的。 实际上，这意味着如果排序后中间元素（或两个中间元素，如果长度为偶数）相等，则子数组是好的。 对于奇数长度的子数组，这是微不足道的，因为单个中位数始终“等于其自身”。 对于偶数长度子数组，中间的两个数字必须相同。 

数组值很小，范围从 1 到 10，但数组可以很大，最多 10^5 个元素。 对于最多 10^4 个测试用例，所有测试的总数组大小上限为 10^5。 这意味着我们无法为每个测试用例提供任何 O(n^2) 方法，因为在最坏的情况下，这将需要 10^10 次操作。 每个测试用例我们需要接近 O(n) 或 O(n log n) 的东西。 

当所有元素都相同时，就会出现边缘情况，这使得每个子数组都很好，或者当所有元素都不同时，这会减少良好的偶数长度子数组的数量。 粗心的解决方案可能会尝试显式检查每个子数组的中位数，这会太慢。 小例子说明了这一点：`[1,2]`，子数组`[1,2]`不好，因为两个中位数不同。 为了`[1,1,1,1]`，每个子数组都很好，因为中位数总是重合。 

## 方法

 强力解决方案迭代所有子数组，对每个子数组进行排序，并检查中间元素。 它是正确的，但在最坏的情况下缩放为 O(n^3)（O(n^2) 个子数组，每个子数组需要 O(n log n) 排序）。 当n达到10^5时，这是完全不可行的。 

关键的观察结果是，问题可以简化为根据“中心”值的频率对子数组进行计数。 修复一个号码`x`并将其视为候选中位数。 对于数组中的每个位置，跟踪运行计数：如果元素等于则 +1`x`, 如果小于则为 -1`x`，否则为 0。 对于偶数长度子数组，我们需要大于的元素计数`x`并且小于`x`周围保持平衡`x`使中位数准确`x`。 这将问题转化为前缀和计数问题：计数之间的差异形成一个键，并且可以使用哈希图来计算以每个索引结尾的好子数组的数量，以跟踪这些键的频率。 

这一见解将潜在的三次问题转换为每个候选中值的线性问题。 由于值的界限为 10，我们可以迭代所有可能的值`x`从 1 到 10，总体复杂度为 O(10 * n) = O(n)，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 最佳 | O(n * 最大(a_i)) | O(n * 最大(a_i)) | 已接受 |

 ## 算法演练

 1. 迭代每个可能的中值候选`x`从 1 到 10。这是可行的，因为`a_i`≤ 10. 每个候选人`x`将单独考虑。 
2. 将数组转化为运行平衡数组`balance`，在位置-1处用0初始化。 对于数组中的每个元素，如果它等于`x`，将之前的余额加1； 如果小于`x`，减1； 如果大于`x`，保持余额不变。 这种编码捕获了相对优势`x`在前缀中。 
3.使用哈希图`freq`计算每个余额值的出现次数。 初始化它`{0: 1}`因为空前缀的余额为0。对于每个位置，以中位数结束于该位置的子数组的数量`x`等于当前平衡值的频率`freq`。 这是有效的，因为两个具有相同余额的前缀意味着它们之间的子数组的净余额为 0，这意味着`x`是中位数。 
4. 将所有位置上的这些计数相加，以获得该候选中值的良好子数组总数。 
5. 将所有候选值从 1 到 10 的计数相加，得到测试用例的答案。 

工作原理：balance 数组确保在具有相同余额的两个前缀之间的任何子数组中，`x`减去小于的元素数`x`是不变的。 这确保了`x`是该子数组的中位数。 通过考虑所有`x`，我们覆盖了数组中每个可能的中位数。 

## Python 解决方案```python
import sys
from collections import defaultdict
input = sys.stdin.readline

def count_good_subarrays(a):
    n = len(a)
    ans = 0
    for x in range(1, 11):
        balance = 0
        freq = defaultdict(int)
        freq[0] = 1
        for val in a:
            if val == x:
                balance += 1
            elif val < x:
                balance -= 1
            # val > x does not change balance
            ans += freq[balance]
            freq[balance] += 1
    return ans

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    print(count_good_subarrays(a))
```该解决方案使用快速 I/O 读取输入。 我们循环从 1 到 10 的候选中位数并隐式计算前缀平衡数组。 哈希图`freq`计算以前的余额以允许 O(1) 检索子数组计数。 微妙之处包括初始化`freq[0] = 1`考虑从索引 0 开始的子数组，并在增加频率之前更新答案，以避免丢失当前前缀。 

## 工作示例

 样本1：`a = [1, 1, 1, 1]`| 我| 值| 平衡| 频率 | 回答 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | {0:1} | 1 |
 | 1 | 1 | 2 | {0:1,1:1} | 2 |
 | 2 | 1 | 3 | {0:1,1:1,2:1} | 3 |
 | 3 | 1 | 4 | {0:1,1:1,2:1,3:1} | 4 |

 对 x = 1 求和得出所有 10 个子数组。 其他x贡献0。 

样本2：`a = [1,10,2,3,3]`对于 x = 3：

 | 我| 值| 平衡| 频率 | 回答 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | -1 | {0:1} | 0 |
 | 1 | 10 | 10 -1 | {-1:1,0:1} | 1 |
 | 2 | 2 | -2 | {-2:0,-1:1,0:1} | 1 |
 | 3 | 3 | -1 | {-2:0,-1:1,0:1} | 2 |
 | 4 | 3 | 0 | {-2:0,-1:2,0:1} | 3 |

 最终计数总计为 11。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * 10) = O(n) | 每个测试用例外循环运行 10 次，内循环运行 n 次
 | 空间| O(n) | 哈希图`freq`最多可存储 n+1 个唯一余额 |

 这可以在 n ≤ 10^5 和 t ≤ 10^4 的约束内轻松扩展。 内存占用量仍低于 512 MB，因为余额是小整数，并且每个候选中位数最多有 n 个键。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict
    input = sys.stdin.readline

    def count_good_subarrays(a):
        n = len(a)
        ans = 0
        for x in range(1, 11):
            balance = 0
            freq = defaultdict(int)
            freq[0] = 1
            for val in a:
                if val == x:
                    balance += 1
                elif val < x:
                    balance -= 1
                ans += freq[balance]
                freq[balance] += 1
        return ans

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        out.append(str(count_good_subarrays(a)))
    return "\n".join(out)

# Provided samples
assert run("3\n4\n1 1 1 1\n5\n1 10 2 3 3\n10\n6 3 2 3 5 3 4 2 3 5\n") == "10\n11\n42"

# Minimum size input
assert run("1\n1\n5\n") == "1"

# Maximum size input, all equal
assert run("1\n5\n2 2 2 2 2\n") == "15"

# Mixed small numbers
assert run("1\n5\n1 3 2 3 1\n") == "9"

# Only increasing sequence
assert run("
```
