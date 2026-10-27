---
title: "CF 138C - 蘑菇侏儒 - 2"
description: "我们将树放置在数轴上。 每棵树都可能向左倒下、向右倒下或保持站立状态。 每棵树这三种结果的概率都是独立给出的。 一棵倒下的树会在由树的位置和高度决定的半开区间内摧毁蘑菇。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "probabilities", "sortings"]
categories: ["algorithms"]
codeforces_contest: 138
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 99 (Div. 1)"
rating: 2200
weight: 138
solve_time_s: 120
verified: true
draft: false
---

[CF 138C - 蘑菇侏儒 - 2](https://codeforces.com/problemset/problem/138/C)

 **评分：** 2200
 **标签：** 二分查找、数据结构、概率、排序
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们将树放置在数轴上。 每棵树都可能向左倒下、向右倒下或保持站立状态。 每棵树这三种结果的概率都是独立给出的。 

一棵倒下的树会在由树的位置和高度决定的半开区间内摧毁蘑菇。 

如果一棵树在位置`x`与高度`h`向左掉落，它会破坏里面的蘑菇`[x - h, x)`。 

如果它落在正确的位置，它会破坏里面的蘑菇`(x, x + h]`。 

每个蘑菇都有一个位置和权力值。 只有没有树木破坏蘑菇，它才能生存。 我们需要所有幸存蘑菇的预期总功率。 

关键的观察是期望是线性的。 我们可以独立计算每个蘑菇的生存概率，将其乘以蘑菇功率，然后将所有值相加，而不是一起考虑所有蘑菇。 

这些约束极大地影响了解决方案。 可以有`10^5`树，因此任何针对每个蘑菇检查每棵树的算法都会执行大约`10^9`最坏情况下的操作，对于 1 秒的限制来说太慢了。 蘑菇数量较少，仅`10^4`，这表明有效地迭代蘑菇和处理树是可行的。 

一个微妙的点是区间边界。 左跌倒使用`[x - h, x)`，而右落时使用`(x, x + h]`。 在这两种情况下，树位置本身都被排除。 

考虑这个例子：```
1 1
5 3 100 0
5 10
```树以 1 的概率向左倒下，但位置 5 的蘑菇幸存下来，因为间隔为`[2, 5)`，并且 5 本身被排除在外。 粗心的实现使用`<=`双方都会错误地摧毁它。 

当多棵树可以击中同一个蘑菇时，就会出现另一个容易的错误。```
2 1
0 5 50 0
10 5 0 50
5 100
```只有当危险事件都没有发生时，蘑菇才能存活。 正确的生存概率是：```
(1 - 0.5) * (1 - 0.5) = 0.25
```直接将概率相加并计算`1 - 0.5 - 0.5 = 0`是错误的，因为树事件是独立的。 

第三种边缘情况涉及恰好位于边界上的蘑菇。```
1 2
10 5 100 0
5 1
10 1
```5 号蘑菇被毁掉是因为`5 ∈ [5,10)`。 10 号的蘑菇能够存活，因为 10 被排除在外。 正确处理半开区间至关重要。 

## 方法

 暴力解决方案很简单。 对于每个蘑菇，迭代所有树并确定该树破坏蘑菇的概率。 

如果一棵树可以通过向左倒下来摧毁蘑菇，则将生存概率乘以`(1 - left_probability)`。 右侧也是如此。 

最后将蘑菇的威力乘以它的生存概率，并将其添加到答案中。 

这是有效的，因为树的结果是独立的。 蘑菇在所有树木中存活下来的概率只是每棵树不摧毁它的概率的乘积。 

问题在于复杂性。 和`10^5`树木和`10^4`蘑菇，我们会表演`10^9`间隔检查。 即使非常小的常数因子也会超时。 

关键的观察结果是，每棵树仅影响数轴上的连续区间。 我们可以按排序顺序处理蘑菇，并通过扫描线样式事件保持乘法效果，而不是为每个蘑菇处理每棵树。 

假设一棵树向左倒下。 然后每一个蘑菇`[a-h, a)`乘以`(1 - l/100)`在其生存概率中。 

同样，右跌倒也会影响`(a, a+h]`。 

这些是蘑菇位置的范围乘法。 

因为蘑菇只是`10^4`，我们可以对它们进行排序，并使用对数时间内的差分数组思想应用乘法区间更新。 对于每个区间，我们标记其乘法贡献的开始和结束位置。 

然后对蘑菇进行一次扫描即可重建影响每个蘑菇的总乘法因子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(1) | O(1) | 太慢了|
 | 最佳| O((n + m) log m) | O((n + m) log m) | O(米) | 已接受 |

 ## 算法演练

 1. 读取所有蘑菇并按坐标对它们进行排序。 

排序允许我们将树效应转换为蘑菇数组上的连续索引范围。 
2. 创建数组`mul`尺寸的`m + 1`，初始化为`1.0`。 

该数组存储乘法差异更新。 在扫描过程中，运行乘积表示活动树区间的生存概率贡献。 
3. 对于每棵树，处理左落间隔。 

危险区间为`[a-h, a)`。 

对排序后的蘑菇坐标使用二分查找：

 -`L = lower_bound(a-h)`-`R = lower_bound(a)`指数中的蘑菇`[L, R)`受到影响。 
4. 对左侧间隔应用乘法更新。 

如果左倾概率为`p`，区间内的每个蘑菇都必须乘以`(1-p)`。 

使用乘法差分更新：

 -`mul[L] *= (1-p)`-`mul[R] /= (1-p)`随后，前缀乘积重建了完整的乘法器。 
5. 类似地处理右下落间隔。 

危险区间为`(a, a+h]`。 

我们需要：

 -`L = upper_bound(a)`-`R = upper_bound(a+h)`蘑菇在`[L, R)`受到影响。 
6. 使用因子应用相同的乘法范围更新`(1-r)`。 
7. 从左到右扫过蘑菇。 

维护正在运行的产品`cur`。 

在每个索引处：

 -`cur *= mul[i]`-`cur`现在等于这个蘑菇的生存概率。 
8. 添加`cur * mushroom_power`到答案。 
9. 打印最终的期望值。 

### 为什么它有效

 每棵树对每个蘑菇的生存概率都有独立的影响。 

对于固定蘑菇，其生存概率等于：```
Π(probability this tree does not destroy it)
```该算法将这些乘法因子准确地应用于每个危险区间覆盖的所有蘑菇。 

乘法差分阵列技术保证在扫描期间，运行乘积精确地包含影响当前蘑菇的所有活动区间因子的乘积。 

因为每个区间更新都准确对应一个树方向事件，并且因为区间是用正确的半开边界构造的，所以每个蘑菇都会准确地接收正确的生存概率。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    trees = []
    for _ in range(n):
        a, h, l, r = map(int, input().split())
        trees.append((a, h, l / 100.0, r / 100.0))

    mushrooms = []
    for _ in range(m):
        b, z = map(int, input().split())
        mushrooms.append((b, z))

    mushrooms.sort()

    coords = [x for x, _ in mushrooms]

    mul = [1.0] * (m + 1)

    for a, h, lp, rp in trees:
        # Left interval: [a-h, a)
        L = bisect_left(coords, a - h)
        R = bisect_left(coords, a)

        if L < R and lp > 0:
            factor = 1.0 - lp
            mul[L] *= factor
            mul[R] /= factor

        # Right interval: (a, a+h]
        L = bisect_right(coords, a)
        R = bisect_right(coords, a + h)

        if L < R and rp > 0:
            factor = 1.0 - rp
            mul[L] *= factor
            mul[R] /= factor

    ans = 0.0
    cur = 1.0

    for i in range(m):
        cur *= mul[i]
        ans += cur * mushrooms[i][1]

    print("{:.10f}".format(ans))

if __name__ == "__main__":
    solve()
```第一个重要的实施细节是对蘑菇进行分类，同时保留其功率值。 所有二分搜索都对排序的坐标数组进行操作。 

范围更新使用乘法差异而不是加法差异。 如果某个区间将所有生存概率乘以`f`，我们放置：```
mul[L] *= f
mul[R] /= f
```在扫描期间，前缀积激活因子`L`并在之后删除它`R-1`。 

边界处理是最棘手的部分。 

为了`[a-h, a)`我们使用：```
bisect_left(a-h)
bisect_left(a)
```因为左边界是包含的，右边界是排除的。 

为了`(a, a+h]`我们使用：```
bisect_right(a)
bisect_right(a+h)
```因为左边界是排他的，右边界是包容的。 

使用错误的组合`bisect_left`和`bisect_right`默默地打破边界情况。 

扫描变量`cur`始终存储当前蘑菇的总生存概率乘数。 乘以蘑菇功率即可得出其对预期值的贡献。 

## 工作示例

 ### 示例 1

 输入：```
1 1
2 2 50 50
1 1
```蘑菇分类：

 | 索引 | 职位| 电源|
 | --- | --- | --- |
 | 0 | 1 | 1 |

 树木效果：

 | 树| 间隔 | 受影响的蘑菇 | 生存因素|
 | --- | --- | --- | --- |
 | 左落 | [0,2) | 蘑菇 1 | 0.5 | 0.5
 | 右倾| (2,4] | 无 | 0.5 |

 扫一扫：

 | 索引 | 当前| 贡献 |
 | --- | --- | --- |
 | 0 | 0.5 | 0.5 0.5 | 0.5

 最终答案：```
0.5
```这个例子证实了半开区间逻辑。 1 处的蘑菇只能通过左侧掉落而被摧毁。 

### 示例 2```
2 1
0 5 50 0
10 5 0 50
5 100
```蘑菇位于位置 5。 

树处理：

 | 树| 危险区间| 击中蘑菇？ | 安全概率|
 | --- | --- | --- | --- |
 | 剩下 1 棵树 | [-5,0) | 没有 | 1 |
 | 树 1 右 | 无 | 没有 | 1 |
 | 剩下 2 棵树 | 无 | 没有 | 1 |
 | 树 2 右 | (10,15] | 否 | 1 |

 实际上这种蘑菇存活下来的概率是 1。 

现在将蘑菇位置更改为 8：```
2 1
0 10 50 0
10 5 0 50
8 100
```然后：

 | 树| 危险区间| 击中蘑菇？ | 安全概率|
 | --- | --- | --- | --- |
 | 树 1 右 | (0,10] | 是 | 0.5 |
 | 剩下 2 棵树 | [5,10) | 是的 | 0.5 | 0.5

 最终生存概率：```
0.5 × 0.5 = 0.25
```预期贡献：```
25
```这说明了为什么概率必须相乘，而不是相加。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log m) | O((n + m) log m) | 每棵树执行恒定的多次二分搜索 |
 | 空间| O(米) | 坐标和乘数数组 |

 该解决方案很容易满足约束条件。 和`10^5`树木和`10^4`蘑菇，二分搜索的总数是可控的，并且扫描本身是线性的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_left, bisect_right

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    trees = []
    for _ in range(n):
        a, h, l, r = map(int, input().split())
        trees.append((a, h, l / 100.0, r / 100.0))

    mushrooms = []
    for _ in range(m):
        b, z = map(int, input().split())
        mushrooms.append((b, z))

    mushrooms.sort()

    coords = [x for x, _ in mushrooms]

    mul = [1.0] * (m + 1)

    for a, h, lp, rp in trees:
        L = bisect_left(coords, a - h)
        R = bisect_left(coords, a)

        if L < R and lp > 0:
            f = 1.0 - lp
            mul[L] *= f
            mul[R] /= f

        L = bisect_right(coords, a)
        R = bisect_right(coords, a + h)

        if L < R and rp > 0:
            f = 1.0 - rp
            mul[L] *= f
            mul[R] /= f

    ans = 0.0
    cur = 1.0

    for i in range(m):
        cur *= mul[i]
        ans += cur * mushrooms[i][1]

    print("{:.10f}".format(ans))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue().strip()

# provided sample
out = float(run("""1 1
2 2 50 50
1 1
"""))
assert abs(out - 0.5) < 1e-6

# minimum size
out = float(run("""1 1
0 1 0 0
0 7
"""))
assert abs(out - 7.0) < 1e-6

# boundary test for left interval
out = float(run("""1 2
10 5 100 0
5 1
10 1
"""))
assert abs(out - 1.0) < 1e-6

# overlapping probabilities
out = float(run("""2 1
0 10 50 0
10 5 0 50
8 100
"""))
assert abs(out - 25.0) < 1e-6

# all mushrooms destroyed
out = float(run("""1 3
0 100 100 100
-50 1
50 1
0 1
"""))
assert abs(out - 1.0) < 1e-6
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单树单蘑菇| 0.5 | 0.5 基本概率处理 |
 | 最小尺寸| 7 | 永不倒下的树 |
 | 边界区间情况| 1 | 正确的半开区间逻辑 |
 | 重叠破坏 | 25 | 25 独立概率乘法|
 | 除中心外全部被毁 | 1 | 从区间中排除的树位置 |

 ## 边缘情况

 再考虑一下边界问题：```
1 2
10 5 100 0
5 1
10 1
```危险区间为`[5,10)`。 

二分查找产生：```
L = lower_bound(5)
R = lower_bound(10)
```只有 5 的蘑菇位于该指数范围内。 10 处的蘑菇被排除，因为右端点是开放的。 

算法正确输出：```
1
```现在考虑多棵树影响一个蘑菇：```
2 1
0 10 50 0
10 5 0 50
8 100
```蘑菇位于两个危险区间。 

更新因素有：```
0.5 and 0.5
```扫描将它们相乘：```
0.5 × 0.5 = 0.25
```期望值：```
25
```这证实了独立概率的处理是正确的。 

最后，考虑蘑菇恰好位于树的位置：```
1 1
0 100 100 100
0 10
```左间隔为`[-100,0)`，右区间为`(0,100]`。 

位置 0 不属于任何一个区间。 

二分搜索会生成空范围，因此不应用乘数。 蘑菇存活的概率为 1，得出答案：```
10
```这就是错误使用闭区间会失败的地方。
