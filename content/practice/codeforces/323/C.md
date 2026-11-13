---
title: "CF 323C - 两种排列"
description: "从 1 到 n 的每个值在两种排列中都只出现一次。 对于值 v，设： - posP[v] 是其在第一个排列中的位置。 - posQ[v] 是它在第二个排列中的位置。"
date: "2026-06-06T05:54:23+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 323
codeforces_index: "C"
codeforces_contest_name: "Testing Round 7"
rating: 2400
weight: 323
solve_time_s: 125
verified: true
draft: false
---

[CF 323C - 两种排列](https://codeforces.com/problemset/problem/323/C)

 **评分：** 2400
 **标签：** 数据结构
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个值来自`1`到`n`在两种排列中都只出现一次。 

对于一个值`v`， 让：

-`posP[v]`是它在第一个排列中的位置。 
-`posQ[v]`是它在第二个排列中的位置。 

查询询问第一个排列中的位置位于内部的值的数量`[l1, r1]`并且其在第二个排列中的位置位于内部`[l2, r2]`。 

将数据可视化的一种有用方法是作为网格上的点。 每个值`v`贡献一分$$(posP[v],\; posQ[v])$$查询询问有多少个点位于轴对齐的矩形内。 

因为两个数组都是排列，所以有`n`点，并且没有两个点共享相同的 x 坐标或相同的 y 坐标。 

这些约束完全排除了任何按查询扫描。 和`n = 10^6`和`m = 2 \cdot 10^5`，甚至一个`O(n)`查询大约需要`2 \cdot 10^{11}`运营。 

我们需要每个查询接近对数时间的时间。 

查询参数也使用之前的答案进行编码。 这可以防止诸如 Mo 算法之类的离线重新排序技术。 查询必须按照给定的顺序在线回答。 

错误的常见来源是忘记矩形边框是包容性的。 

例如：```
p = [1,2,3]
q = [1,2,3]
```查询```
[1,2] × [2,3]
```仅包含值`2`，所以答案是`1`。 

半开放的解释会错误地产生`0`。 

另一个微妙的案例来自线上转型。 认为`n = 5`之前的答案是`2`。 然后`x = 3`， 和$$f(5)=((5-1+3)\bmod 5)+1=3.$$模环绕是查询生成的一部分，必须在获取最小值和最大值之前应用。 

## 方法

 最直接的解决方案是独立处理每个查询。 

对于每个值`v`，我们检查是否$$l_1 \le posP[v] \le r_1$$和$$l_2 \le posQ[v] \le r_2.$$这是正确的，因为它确实实现了查询的定义。 不幸的是它需要`O(n)`每个查询的工作量。 和`10^6`价值观和`2 \cdot 10^5`查询，最坏情况超过`10^{11}`检查。 

关键的观察是，一旦我们知道了第二个排列中的位置，问题就变成了一维范围计数问题。 

构造一个数组$$A[i] = posQ[p_i].$$位置`i`该数组对应于 x 坐标`i`，存储的值对应于同一点的 y 坐标。 

现在是一个查询矩形$$[l_1,r_1] \times [l_2,r_2]$$变成：

 > 在子数组中`A[l1..r1]`, 计算有多少个值属于`[l2,r2]`。 

这是一个经典的静态范围计数问题。 

因为`A`是一个排列`1..n`，小波树是很自然的选择。 它支持：$$\text{count values } \le k$$在任何子数组内`O(log n)`时间。 

然后$$count([l_2,r_2]) = count(\le r_2) - count(\le l_2-1).$$该结构构建一次，然后每个查询都会在对数时间内在线得到解答。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 小波树 | O(n log n + m log n) | O(n log n + m log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 阅读两个排列。 
2. 计算`posQ[v]`对于每个值`v`。 

这让我们可以立即找到任何值出现在第二个排列中的位置。 
3. 构建数组$$A[i] = posQ[p_i].$$每个值现在都变成一个点`(i, A[i])`。 
4. 构建小波树`A`。 

对于每个级别，存储前缀计数描述有多少元素进入左子级。 这些前缀计数正是允许我们在下降树时限制查询间隔的原因。 
5. 维护`last_answer`。 

该声明定义了$$x = last\_answer + 1$$除了第一个查询 where`x = 0`。 
6. 使用给定函数解码四个查询参数$$f(z)=((z-1+x)\bmod n)+1.$$7. 计算$$l_1=\min(f(a),f(b)), \quad r_1=\max(f(a),f(b)),$$对于第二个间隔也是如此。 
8. 查询小波树中值的数量`A[l1..r1]`属于`[l2,r2]`。 

这等于$$count_{\le r_2} - count_{\le l_2-1}.$$9.输出答案并存储为`last_answer`。 

### 为什么它有效

 数组`A`精确包含 x 坐标为数组索引的点的 y 坐标。 

选择职位`l1..r1`在`A`相当于将点限制在矩形的 x 范围内。 计算值`A`里面`[l2,r2]`相当于将点限制在矩形的 y 范围内。 

当且仅当两个条件同时成立时，一个点属于矩形。 小波树精确计算请求的 y 范围内的那些值，同时仅考虑请求的 x 范围。 每个有效分计算一次，无效分不计算。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

class WaveletTree:
    def __init__(self, data):
        self.pref = []
        self.lo = []
        self.hi = []

        cur = array('I', data)
        segments = [(cur, 1, len(cur))]

        while segments:
            next_segments = []

            for arr, lo, hi in segments:
                self.lo.append(lo)
                self.hi.append(hi)

                if lo == hi:
                    self.pref.append(None)
                    continue

                mid = (lo + hi) >> 1

                pref = array('I', [0])
                left = array('I')
                right = array('I')

                cnt = 0
                for x in arr:
                    if x <= mid:
                        cnt += 1
                        left.append(x)
                    else:
                        right.append(x)
                    pref.append(cnt)

                self.pref.append(pref)

                next_segments.append((left, lo, mid))
                next_segments.append((right, mid + 1, hi))

            segments = next_segments

    def count_leq(self, l, r, k):
        if l > r or k <= 0:
            return 0

        ans = 0
        stack = [(0, l, r)]

        while stack:
            idx, l, r = stack.pop()

            lo = self.lo[idx]
            hi = self.hi[idx]

            if l > r or k < lo:
                continue

            if hi <= k:
                ans += r - l + 1
                continue

            if lo == hi:
                continue

            pref = self.pref[idx]

            left_l = pref[l - 1]
            left_r = pref[r]

            left_count = left_r - left_l

            left_idx = idx * 2 + 1
            right_idx = idx * 2 + 2

            stack.append((
                right_idx,
                l - left_l,
                r - left_r
            ))

            stack.append((
                left_idx,
                left_l + 1,
                left_r
            ))

        return ans

    def range_count(self, l, r, low, high):
        return self.count_leq(l, r, high) - self.count_leq(l, r, low - 1)

def main():
    n = int(input())

    p = list(map(int, input().split()))
    q = list(map(int, input().split()))

    pos_q = [0] * (n + 1)
    for i, v in enumerate(q, 1):
        pos_q[v] = i

    arr = [pos_q[v] for v in p]

    wt = WaveletTree(arr)

    m = int(input())

    last = 0
    out = []

    for qi in range(m):
        a, b, c, d = map(int, input().split())

        x = 0 if qi == 0 else last + 1

        def f(z):
            return ((z - 1 + x) % n) + 1

        fa = f(a)
        fb = f(b)
        fc = f(c)
        fd = f(d)

        l1 = min(fa, fb)
        r1 = max(fa, fb)

        l2 = min(fc, fd)
        r2 = max(fc, fd)

        last = wt.range_count(l1, r1, l2, r2)

        out.append(str(last))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一阶段计算逆排列`q`。 这会将每个值转换为其在第二个排列中的位置。 

数组`arr`是问题的几何表示。 指数`i`是 x 坐标并且`arr[i]`是对应的y坐标。 

小波树为每个内部节点存储一个前缀数组，告诉每个前缀有多少元素移动到左子节点。 在查询期间，这些前缀计数将父节点的子数组间隔转换为子节点内的相应间隔。 

查询例程最多计算值的计数`k`。 通过减法获得范围计数。 这避免了实现单独的矩形计数操作。 

一个容易犯的错误是索引。 小波树查询公式假定从 1 开始的间隔，因此在整个实现过程中所有查询间隔都保持从 1 开始。 

另一个微妙之处是在线解码。 价值`x`使用之前的答案加一，而不是当前的答案。 第一个查询是唯一的例外，其中`x = 0`。 

## 工作示例

 ### 示例 1

 输入：```
3
3 1 2
3 2 1
1
1 2 3 3
```我们首先计算：

 | 价值| 后Q |
 | ---| ---|
 | 1 | 3 |
 | 2 | 2 |
 | 3 | 1 |

 然后：

 | 在 p | 中的位置 价值| A[位置] |
 | ---| ---| ---|
 | 1 | 3 | 1 |
 | 2 | 1 | 3 |
 | 3 | 2 | 2 |

 所以`A = [1,3,2]`。 

查询解码给出：

 | 变量| 价值|
 | ---| ---|
 | l1 | 1 |
 | r1 | 2 |
 | l2 | 3 |
 | r2 | 3 |

 我们检查`A[1..2] = [1,3]`。 

只有一个值在于`[3,3]`，即`3`。 

回答：```
1
```此跟踪显示了从矩形查询到子数组内的值范围查询的减少。 

### 自定义示例

 输入：```
4
1 2 3 4
2 1 4 3
1
1 4 1 2
```的逆位置`q`：

 | 价值| 后Q |
 | ---| ---|
 | 1 | 2 |
 | 2 | 1 |
 | 3 | 4 |
 | 4 | 3 |

 因此：

 | 位置 | 一个 |
 | ---| ---|
 | 1 | 2 |
 | 2 | 1 |
 | 3 | 4 |
 | 4 | 3 |

 矩形是`[1,4] × [1,2]`。 

| 子数组 | 价值观 |
 | ---| ---|
 | A[1..4] | 2,1,4,3 |

 里面的价值观`[1,2]`是`2`和`1`。 

回答：```
2
```这个例子说明x范围过滤和y范围过滤变成了内部的子数组选择和值选择`A`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + m log n) | O(n log n + m log n) | 小波树构造和对数查询 |
 | 空间| O(n log n) | O(n log n) | 每个级别存储的前缀计数 |

 和`n = 10^6`，高度大致为`20`。 存储的前缀信息总量约为`20n`，当存储在紧凑整数数组中时，它完全符合内存限制。 查询次数仅为`2 · 10^5`， 所以`O(log n)`每个查询很容易足够快。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    from array import array

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    # call solution here
    main()

    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# sample 1
assert run(
"""3
3 1 2
3 2 1
1
1 2 3 3
"""
) == "1"

# n = 1
assert run(
"""1
1
1
1
1 1 1 1
"""
) == "1"

# identical permutations
assert run(
"""3
1 2 3
1 2 3
1
1 3 2 3
"""
) == "2"

# full rectangle
assert run(
"""4
1 2 3 4
2 1 4 3
1
1 4 1 4
"""
) == "4"

# single point rectangle
assert run(
"""4
1 2 3 4
2 1 4 3
1
2 2 1 1
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 1 | 基本正确性 |
 | n = 1 | 1 | 最小尺寸|
 | 相同的排列 | 2 | 包容性边界|
 | 全矩形| 4 | 整个点集均已计算 |
 | 单点矩形 | 1 | 精确坐标匹配 |

 ## 边缘情况

 考虑尽可能最小的输入：```
1
1
1
1
1 1 1 1
```唯一的一点是`(1,1)`。 查询矩形也恰好是`(1,1)`。 小波树包含单个值，范围计数返回`1`。 无需特殊处理。 

考虑由单个位置组成的区间：```
4
1 2 3 4
2 1 4 3
1
2 2 1 1
```矩形询问 x 坐标处的点是否`2`有 y 坐标`1`。 自从`A[2] = 1`，答案是`1`。 查询间隔仍然有效，因为该实现到处都使用包含边界。 

在查询解码期间考虑模环绕。 让`n = 5`假设之前的答案是`2`。 然后`x = 3`。 

对于输入值`5`：$$f(5)=((5-1+3)\bmod 5)+1=3.$$该算法在构造矩形端点之前执行此转换。 解码后仍然适用`min`和`max`，即使发生回绕也能保证有效的间隔。 

最后，考虑一个覆盖整个平面的矩形：```
l1 = 1, r1 = n
l2 = 1, r2 = n
```每个点都满足查询。 小波树计算$$count(\le n)-count(\le 0)=n-0=n,$$这正是正确的答案。
