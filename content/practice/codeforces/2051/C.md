---
title: "CF 2051C - 准备考试"
description: "有 $n$ 可能的考试问题。 每个可用的考试版本都包含除一个之外的所有问题。 $ai$ 值告诉我们第 $i$ 个版本中省略了哪个问题。 Monocarp 知道一组 $k$ 问题。"
date: "2026-06-08T08:40:17+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2051
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 995 (Div. 3)"
rating: 1000
weight: 2051
solve_time_s: 119
verified: true
draft: false
---

[CF 2051C - 准备考试](https://codeforces.com/problemset/problem/2051/C)

 **评分：** 1000
 **标签：** 构造性算法，实现
 **求解时间：** 1m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有$n$可能的考试问题。 每个可用的考试版本都包含除一个之外的所有问题。 价值$a_i$告诉我们哪个问题被省略了$i$-th 版本。 

Monocarp 知道一组$k$问题。 对于每个考试版本，我们必须确定该版本中出现的每个问题是否属于他所知道的问题。 

输出是一个长度为的二进制字符串$m$。 这$i$第 - 个字符是`1`如果 Monocarp 通过了省略问题的考试版本$a_i$， 否则`0`。 

制约因素很大。 全部的总和$n$跨测试用例的值达到$3 \cdot 10^5$，所以任何显式检查所有的算法$n-1$每个考试版本中的问题都需要$O(nm)$工作并且会太慢。 我们需要一个基本上以线性时间处理每个测试用例的解决方案。 

一个微妙的观察是，每个考试版本与全套问题的不同之处在于缺少一个问题。 这极大地限制了可能发生的情况的数量。 

考虑以下边缘情况：```
n = 5
known = {1,2,3}
```有两道未知题，即 4 题和 5 题。任何考试版本都只省略一道题。 即使省略的问题是 4，问题 5 仍然出现在考试中，而 Monocarp 并不知道。 每个答案都必须是`0`。 

另一个重要案例是：```
n = 5
known = {1,2,3,4}
```现在只有一个未知问题，即 5。Monocarp 唯一可以通过的考试版本是省略问题 5 的版本。所有其他版本仍然包含问题 5。 

最后，如果 Monocarp 知道所有问题，他就会通过每个版本。 

## 方法

 直接方法将构建每个考试版本并验证其所有版本是否$n-1$问题属于已知集合。 由于有$m$版本，这需要花费$O(nm)$。 和$n$和$m$跨越输入都达到几十万，这是不可行的。 

关键的观察是，只有未知问题的数量才重要。 

让$$U = n-k$$是 Monocarp 不知道的问题数量。 

如果$U \ge 2$，每个考试版本只省略一个问题，因此考试中至少保留一个未知问题。 通过是不可能的。 

如果$U = 1$，令唯一的未知问题为$x$。 Monocarp 完全通过了那些省略的考试版本$x$。 

如果$U = 0$，Monocarp 知道一切并通过所有版本。 

这将整个问题简化为确定有多少问题是未知的，并且在一种特殊情况下，找到唯一的未知问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nm)$|$O(n)$| 太慢了|
 | 最佳 |$O(n+m)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 阅读已知问题集。 
2. 计算未知问题的数量：$$U = n-k$$3.如果$U = 0$，输出一串$m$因为每个考试版本都是通过的。 
4. 如果$U \ge 2$，输出一串$m$零，因为每个考试版本仍然包含至少一个未知问题。 
5. 如果$U = 1$，找到唯一的未知问题$x$。 
6. 对于每个值$a_i$：

- 输出`1`如果$a_i = x$。 
- 输出`0`否则。 

原因是考试版本省略了$x$是唯一消除 Monocarp 不知道的唯一问题的版本。 

### 为什么它有效

 假设至少有两个未知问题。 由于每个考试版本仅删除一个问题，因此考试中始终至少保留一个未知问题。 通过是不可能的。 

假设只有一个未知问题$x$。 任何不遗漏的考试版本$x$仍含有$x$，所以 Monocarp 失败了。 版本省略$x$仅包含已知问题，因此 Monocarp 通过。 

假设没有未知问题。 每个考试版本中的每个问题都是已知的，因此 Monocarp 总是会通过。 

这三种情况涵盖了所有的可能性，所以算法是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        q = list(map(int, input().split()))

        known = set(q)
        missing_cnt = n - k

        if missing_cnt == 0:
            ans.append("1" * m)
            continue

        if missing_cnt >= 2:
            ans.append("0" * m)
            continue

        unknown = -1
        for x in range(1, n + 1):
            if x not in known:
                unknown = x
                break

        res = []
        for x in a:
            res.append('1' if x == unknown else '0')

        ans.append(''.join(res))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```直接按照三例分析来实现。 

唯一重要的步骤是在以下情况下找到唯一的未知问题：$n-k=1$。 哈希集给出$O(1)$平均会员检查，因此从 1 扫描到$n$在线性时间内找到它。 

不存在整数溢出问题，因为我们只操作索引和计数。 所有测试用例的总工作量以所有测试用例的总和为界$n$，满足问题极限。 

## 工作示例

 ### 示例 1

 输入：```
n = 4
a = [1,2,3,4]
known = [1,3,4]
```| 数量 | 价值|
 | --- | --- |
 | n | 4 |
 | k | 3 |
 | 未知问题 | {2} |
 | 独特未知| 2 |

 现在评估每个考试版本。 

| 缺少问题$a_i$| 经过？ |
 | --- | --- |
 | 1 | 没有 |
 | 2 | 是的 |
 | 3 | 没有 |
 | 4 | 没有 |

 输出：```
0100
```这说明了这个案例$n-k=1$。 

### 示例 2

 输入：```
n = 5
known = [1,3,4]
```| 数量 | 价值|
 | --- | --- |
 | n | 5 |
 | k | 3 |
 | 未知问题 | {2,5} |
 | 未知数 | 2 |

 由于至少有两道未知题，因此每个考试版本仅删除一道题后仍然包含一道未知题。 

| 考试版 | 经过？ |
 | --- | --- |
 | 任何版本 | 没有 |

 输出：```
0000
```这说明了这个案例$n-k \ge 2$。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n+m)$每个测试用例| 构建集合，如果需要找到唯一的未知数，生成答案 |
 | 空间|$O(k)$| 已知问题的存储|

 因为所有的总和$n$最多超过输入$3 \cdot 10^5$，总运行时间与输入大小保持线性关系并且完全符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def solve():
        input = sys.stdin.readline
        t = int(input())
        out = []

        for _ in range(t):
            n, m, k = map(int, input().split())
            a = list(map(int, input().split()))
            q = list(map(int, input().split()))

            known = set(q)

            if k == n:
                out.append("1" * m)
                continue

            if n - k >= 2:
                out.append("0" * m)
                continue

            unknown = next(x for x in range(1, n + 1) if x not in known)
            out.append("".join('1' if x == unknown else '0' for x in a))

        return "\n".join(out)

    return solve()

# provided sample
assert run(
"""4
4 4 3
1 2 3 4
1 3 4
5 4 3
1 2 3 4
1 3 4
4 4 4
1 2 3 4
1 2 3 4
2 2 1
1 2
2
"""
) == "0100\n0000\n1111\n10"

# minimum size
assert run(
"""1
2 2 2
1 2
1 2
"""
) == "11"

# exactly one unknown
assert run(
"""1
5 5 4
1 2 3 4 5
1 2 3 4
"""
) == "00001"

# two unknowns
assert run(
"""1
5 5 3
1 2 3 4 5
1 2 3
"""
) == "00000"

# unknown question appears first
assert run(
"""1
4 4 3
1 2 3 4
2 3 4
"""
) == "1000"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |$n=2,k=2$|`11`| 所有问题已知 |
 | 一个未知的问题 |`00001`| 正是一个还过得去的版本 |
 | 两个未知的问题 |`00000`| 没有版本可以成功 |
 | 未知问题是 1 |`1000`| 边界值处理|

 ## 边缘情况

 考虑：```
1
4 4 4
1 2 3 4
1 2 3 4
```Monocarp 知道每一个问题。 算法输入$n-k=0$分支和输出`1111`。 每个考试版本都是可以通过的，因为出现的每个问题都是已知的。 

考虑：```
1
5 5 4
1 2 3 4 5
1 2 3 4
```问题5是唯一未知的问题。 该算法发现`unknown = 5`并仅标记版本`a_i = 5`还过得去。 输出是`00001`。 

考虑：```
1
5 5 3
1 2 3 4 5
1 2 3
```问题4和问题5均未知。 该算法检测到$n-k=2$并立即输出`00000`。 删除一个问题无法同时从考试中删除两个未知问题，因此每个版本都会失败。
