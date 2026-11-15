---
title: "CF 71C - 圆桌骑士"
description: "骑士们围成一个圆圈，间隔相等。 每个位置的骑士心情好时标记为 1，心情不好时标记为 0。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 71
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 65 (Div. 2)"
rating: 1600
weight: 71
solve_time_s: 100
verified: true
draft: false
---

[CF 71C - 圆桌骑士](https://codeforces.com/problemset/problem/71/C)

 **评分：** 1600
 **标签：** dp、数学、数论
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 骑士们围成一个圆圈，间隔相等。 每个位置都标记为`1`对于心情好的骑士或`0`对于心情不好的骑士来说。 我们需要确定是否可以选择一些心情好的骑士，使他们组成一个至少有三个顶点的正多边形的顶点。 

因为所有的骑士都在圆周围等距分布，所以每个正多边形都对应于以固定步长大小占据的位置。 例如，如果`n = 12`我们每隔三个选择一个马，我们就得到了一个正方形的顶点。 如果我们选择每隔一个骑士，我们就会得到一个六边形。 

任务变成：是否存在某个步长，以便重复跳跃该步仅访问包含`1`，并且循环至少包含三个不同的位置？ 

约束条件`n ≤ 10^5`立即排除任何接近立方时间的情况。 即使是一个完整的`O(n^2)`在 Python for Codeforces 中，解决方案是有风险的，尤其是时间限制非常小时。 我们需要一些接近线性或`n log n`。 

一个微妙的点是，并非所有好骑士的子集都会形成有效的多边形。 顶点在圆周围的间距必须相等。 粗心的解决方案可能只计算有多少`1`存在并得出结论，至少三个好骑士就足够了。 

考虑：```
6
1 1 1 0 0 0
```正确答案是`NO`。 

虽然是三个好骑士，但是他们是连续的，并不是等距的。 无法形成正多边形。 

当多边形使用所有骑士时，会出现另一个棘手的情况。```
5
1 1 1 1 1
```答案是`YES`。 

整个五边形本身就是一个正多边形。 任何仅检查真因数的实现`n`会错误地错过这一点。 

另一种边缘情况涉及周期太小。```
4
1 0 1 0
```答案是`NO`。 

选择每隔两个骑士只会创建两个顶点，这不是有效的多边形，因为多边形必须包含至少三个点。 

## 方法

 蛮力思想直接遵循几何学。 对于每个可能的多边形大小`k`，我们尝试每个可能的起始位置并检查该多边形的所有顶点是否包含`1`。 

假设多边形有`k`顶点。 那么连续顶点之间的步长是`n / k`， 所以`k`必须划分`n`。 对于每个除数`k ≥ 3`，我们可以测试所有`n`起始位置并走过整个周期。 

这是有效的，因为等距点上的每个正多边形都精确对应于这些循环之一。 

问题是运行时间。 在最坏的情况下，我们可能会检查许多除数，并且对于每一个除数，我们可能会扫描几乎所有位置。 一个幼稚的实现可能会偏向`O(n^2)`，这对于`n = 10^5`。 

关键的观察是我们实际上并不直接关心多边形的大小。 重要的是跳跃距离。 

如果我们跳一步`d`，访问过的位置形成一个循环，其长度为：$$\frac{n}{\gcd(n,d)}$$我们至少只关心周期的长度`3`。 每个有效的正多边形都对应一个这样的循环。 

现在考虑一个除数`k`的`n`， 在哪里`k ≥ 3`。 多边形顶点恰好是：$$i,\ i + \frac{n}{k},\ i + 2\frac{n}{k},\dots$$因此，我们不需要检查任意子集，而只需要测试`n`。 

对于每个除数`k ≥ 3`， 让：$$step = \frac{n}{k}$$然后我们测试每个残差类模`step`。 如果一个残基类中的每个元素都是`1`，我们找到了一个有效的多边形。 

每个位置仅参与有限数量的除数检查，因此总复杂性保持高效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取骑士数量和心情数组。 
2. 枚举所有除数`k`的`n`这样`k ≥ 3`。 

正多边形与`k`顶点只有在以下情况下才可能`k`划分`n`，因为顶点必须在圆周围等距分布。 
3. 对于每个有效`k`，计算：```
step = n // k
```跳过去`step`从一个多边形顶点移动到下一个多边形顶点。 
4. 尝试所有可能的起始偏移量`0`到`step - 1`。 

每个偏移量代表一个等距位置的周期。 
5. 对于固定偏移量，遍历循环：```
offset, offset + step, offset + 2*step, ...
```模数`n`。 
6. 检查该周期中的每个位置是否包含`1`。 

如果一个周期完全由`1`s，打印`YES`立即地。 
7. 如果所有除数配置失败，则打印`NO`。 

### 为什么它有效

 等距圆点上的正多边形必须使用以恒定角距离分隔的顶点。 由于骑士的间距相等，因此这直接转化为固定的索引跳跃。 

如果一个多边形有`k`顶点，那么连续的顶点相差恰好`n / k`职位。 该算法检查每个可能的除数`k`以及该间距的每个可能的起始位置。 

每个有效的多边形都恰好出现在这些检查之一中，并且每个检查的循环都对应于一个有效的正多边形。 因为该算法仅当循环中的所有顶点都包含时才接受`1`，它不会产生误报。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    divisors = []

    d = 1
    while d * d <= n:
        if n % d == 0:
            if d >= 3:
                divisors.append(d)

            other = n // d
            if other != d and other >= 3:
                divisors.append(other)

        d += 1

    for k in divisors:
        step = n // k

        for start in range(step):
            ok = True

            for pos in range(start, n, step):
                if a[pos] == 0:
                    ok = False
                    break

            if ok:
                print("YES")
                return

    print("NO")

solve()
```第一部分计算所有除数`n`可以代表多边形的大小。 我们忽略小于的除数`3`因为少于三个顶点的多边形是无效的。 

对于每个除数`k`，代码使用以下公式导出多边形顶点之间的间距`step = n // k`。 这是从多边形结构到数组索引的关键几何转换。 

嵌套循环结束`start`处理相同多边形图案的不同旋转。 例如，与`step = 3`，序列开始于`0`,`1`， 和`2`是不同的周期。 

最里面的循环检查一个完整的循环。 使用`range(start, n, step)`就足够了，因为位置通过模块化间距自然地环绕圆形结构。 该残基类中的每个位置都属于同一个多边形。 

尽早返回对于性能很重要。 一旦我们找到一个有效的多边形，就不需要进一步的工作。 

一个常见的实现错误是检查除数`step`而不是除数`n`。 另一个简单的错误是忘记多边形使用所有`n`顶点是有效的。 

## 工作示例

 ### 示例 1

 输入：```
3
1 1 1
```| k | 步骤| 开始 | 检查位置 | 所有的|
 | --- | --- | --- | --- | --- |
 | 3 | 1 | 0 | 0,1,2 | 是的 |

 该算法立即发现所有三个位置形成一个有效的正三角形。 由于每个骑士心情都很好，所以答案是`YES`。 

### 示例 2

 输入：```
6
1 0 1 0 1 0
```| k | 步骤| 开始 | 检查位置 | 所有的|
 | --- | --- | --- | --- | --- |
 | 3 | 2 | 0 | 0,2,4 | 是的 |

 职位`0`,`2`， 和`4`等距并且都包含`1`。 这些顶点在圆上形成一个等边三角形。 

该迹线演示了核心不变量：由恒定步长分隔的位置完全对应于正多边形。 

### 示例 3

 输入：```
6
1 1 1 0 0 0
```| k | 步骤| 开始 | 检查位置 | 所有的|
 | --- | --- | --- | --- | --- |
 | 3 | 2 | 0 | 0,2,4 | 没有 |
 | 3 | 2 | 1 | 1,3,5 | 没有 |
 | 6 | 1 | 0 | 0,1,2,3,4,5 | 没有 |

 没有等距循环只包含`1`s，所以答案是`NO`。 

This case shows why simply counting good knights is insufficient.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | Each divisor check scans arithmetic progressions whose total size remains manageable |
 | 空间| O(1) | O(1) | Only a few auxiliary variables besides the input array |

 该解决方案完全符合约束条件。 即使是为了`n = 10^5`，除数的数量很少，并且仅在基于除数的扫描中重新访问每个数组位置。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n = int(input())
        a = list(map(int, input().split()))

        divisors = []

        d = 1
        while d * d <= n:
            if n % d == 0:
                if d >= 3:
                    divisors.append(d)

                other = n // d
                if other != d and other >= 3:
                    divisors.append(other)

            d += 1

        for k in divisors:
            step = n // k

            for start in range(step):
                ok = True

                for pos in range(start, n, step):
                    if a[pos] == 0:
                        ok = False
                        break

                if ok:
                    return "YES"

        return "NO"

    return solve()

# provided sample
assert run("3\n1 1 1\n") == "YES", "sample 1"

# minimum valid polygon
assert run("3\n1 0 1\n") == "NO", "minimum size failure"

# equally spaced triangle
assert run("6\n1 0 1 0 1 0\n") == "YES", "alternating pattern"

# consecutive ones are not enough
assert run("6\n1 1 1 0 0 0\n") == "NO", "non-regular subset"

# all knights good
assert run("5\n1 1 1 1 1\n") == "YES", "whole polygon"

# only two opposite points
assert run("4\n1 0 1 0\n") == "NO", "degenerate polygon"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 / 1 0 1`|`NO`| 最小尺寸处理 |
 |`6 / 1 0 1 0 1 0`|`YES`| 正确的周期检测|
 |`6 / 1 1 1 0 0 0`|`NO`| 拒绝连续但不规则的子集 |
 |`5 / 1 1 1 1 1`|`YES`| 整圆多边形|
 |`4 / 1 0 1 0`|`NO`| 拒绝 2 点退化情况 |

 ## 边缘情况

 考虑输入：```
6
1 1 1 0 0 0
```该算法检查除数`k = 3`, 给予`step = 2`。 

周期为：```
0,2,4
1,3,5
```第一个周期包含一个`0`在位置`4`。 第二个周期包含`0`位于位置`3`和`5`。 不存在有效的多边形。 

这个案例验证了算法需要等间距，而不仅仅是足够的好骑士。 

现在考虑：```
5
1 1 1 1 1
```除数`k = 5`产生`step = 1`。 

唯一的循环是：```
0,1,2,3,4
```每个位置包含`1`，因此算法正确地接受完整的五边形。 

最后，检查：```
4
1 0 1 0
```粗心的实现可能会接受，因为位置`0`和`2`是等间距的。 该算法拒绝这一点，因为仅检查的除数​​是`k ≥ 3`。 

为了`n = 4`，有效除数仅为`4`，生产`step = 1`。 由于并非所有职位都`1`，答案就变成了`NO`。
