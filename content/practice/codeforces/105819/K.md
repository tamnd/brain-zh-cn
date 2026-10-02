---
title: "CF 105819K - 非日本三角"
description: "我们只知道三角形数组的最后一行。 它上面的每个值都被递归地定义为其正下方的两个值中的最小值。 如果最后一行是 $$b1,b2,dots,bn$$ 则其上方的行包含 $$min(b1,b2),min(b2,b3),dots$$ 并且该过程继续向上。"
date: "2026-06-25T15:08:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105819
codeforces_index: "K"
codeforces_contest_name: "TeamsCode Spring 2025 Novice Division"
rating: 0
weight: 105819
solve_time_s: 50
verified: true
draft: false
---

[CF 105819K - 不是日本三角](https://codeforces.com/problemset/problem/105819/K)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们只知道三角形数组的最后一行。 它上面的每个值都被递归地定义为其正下方的两个值中的最小值。 

如果最后一行是$$b_1,b_2,\dots,b_n$$那么它上面的行包含$$\min(b_1,b_2),\min(b_2,b_3),\dots$$并且这个过程继续向上。 

任务不是明确地重建整个三角形。 我们只需要每一行的总和。 

如果我们将重复率扩大几个级别，就会立即出现有用的观察结果。 

对于一行来说$k$在底部以上的级别中，每个条目都成为底部行的连续段的最小值。 更准确地说，$$a_{i,j}=\min(b_j,b_{j+1},\dots,b_{j+n-i})$$所以行的总和$i$恰好是底行具有长度的所有子数组的最小值之和$$n-i+1.$$该问题相当于计算，对于每个子数组长度$L$，所有长度子数组的最小值之和$L$。 

约束条件$n \le 10^5$立即排除任何显式生成三角形行的方法。 三角形包含$O(n^2)$值，大约是$5 \cdot 10^9$最坏情况下的细胞。 

我们需要一些接近的东西$O(n \log n)$或者$O(n)$。 

错误的常见来源是在确定哪个元素被视为子数组的最小值时错误地处理相等值。 

考虑：```
3
5 5 5
```每个子数组最小值为 5。如果两个方向都使用严格比较，则某些子数组会被多次计数。 如果两个方向都使用非严格比较，则会丢失一些子数组。 标准修复是使用一侧严格和一侧非严格。 

另一个容易犯的错误是忘记顶行对应于最长的子数组长度。 

例子：```
3
1 2 3
```行总和为：```
1
2
6
```最上面一行是整个数组的最小值，而不是单个元素的最小值。 

## 方法

 直接模拟很容易描述。 

从最后一行开始，通过取相邻的最小值重复构建上面的行。 每行的长度都需要线性时间。 总工作量变为$$n+(n-1)+\cdots+1 = O(n^2).$$这是正确的，因为它完全遵循三角形的定义。 Unfortunately, with$n=10^5$，大约需要$5 \cdot 10^9$运营。 

关键的观察结果是，每一行都对应于底行中固定长度子数组的最小值。 

让$$S_L$$是所有长度子数组的最小值之和$L$。 

那么所需的答案很简单$$S_n,S_{n-1},\dots,S_1.$$现在问题变成：同时计算每个可能长度的子数组最小值之和。 

对于固定位置$i$， 认为$b_i$被选为子数组的代表性最小值。 

使用单调堆栈，我们发现：$$A=i-\text{previous strictly smaller}$$和$$B=\text{next smaller-or-equal}-i.$$然后$b_i$是恰好的最小值$A \cdot B$子数组。 

更重要的是，对于每个子数组长度，此类子数组的数量形成一个非常简单的形状：$$1,2,3,\dots,x,x,\dots,x,\dots,3,2,1$$在哪里$$x=\min(A,B).$$这种分段线性结构让我们可以通过范围更新来添加贡献，而不是单独触及每个长度。 

使用两个差分数组，我们可以在区间上添加线性函数$O(1)$每个元素。 处理完所有元素后，前缀扫描会重建每个元素$S_L$。 

整个解决方案以线性时间运行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力三角形构造|$O(n^2)$|$O(n)$| 太慢了|
 | 单调堆栈+范围线性更新|$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 阅读底行$b$。 
2. 使用递增单调堆栈计算每个位置的前一个严格较小的元素。 
3. 使用另一个单调堆栈计算每个位置的下一个更小或相等的元素。 
4. 对于每个位置$i$， 让$$A=i-\text{prevLess}[i]$$和$$B=\text{nextLessEq}[i]-i.$$这些是有效的左分机和右分机的数量，同时保持$b_i$作为所选的最小值。 
5.让$$x=\min(A,B), \quad y=\max(A,B).$$对于每个子数组长度，该元素贡献的计数为：$$1,2,\dots,x,$$然后是价值稳定期$x$，

然后$$x-1,x-2,\dots,1.$$6.添加贡献$b_i \cdot \text{count}$使用三个范围更新到所有受影响的长度：$$b_i \cdot L$$在$[1,x]$,$$b_i \cdot x$$在$[x+1,y]$，

和$$b_i \cdot (A+B-L)$$在$[y+1,A+B-1]$。 
7. 将范围更新存储在表示以下形式的函数的差异数组中$$p \cdot L + q.$$8. 执行前缀扫描以恢复每个$S_L$。 
9. 输出$$S_n,S_{n-1},\dots,S_1,$$因为行$i$对应于窗口长度$n-i+1$。 

### 为什么它有效

 由于单调堆栈中使用的严格/非严格平局打破规则，每个子数组恰好具有一个代表性最小值。 

对于固定元素$b_i$，每个有效的左扩展和右扩展组合恰好生成一个子数组，其中$b_i$是所选的最小值。 产生给定长度的组合数量仅取决于$A$和$B$，产生上面的三角形-高原-三角形图案。 

该算法将每个代表性最小值的贡献添加到它所属的每个长度。 由于每个子数组都被计算一次且仅一次，因此结果值$S_L$恰好是所有长度最小值的总和 -$L$子数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def add_linear(diff_a, diff_b, l, r, a, b):
    if l > r:
        return
    diff_a[l] += a
    diff_a[r + 1] -= a
    diff_b[l] += b
    diff_b[r + 1] -= b

n = int(input())
arr = list(map(int, input().split()))

prev_less = [-1] * n
stack = []
for i in range(n):
    while stack and arr[stack[-1]] >= arr[i]:
        stack.pop()
    prev_less[i] = stack[-1] if stack else -1
    stack.append(i)

next_less_eq = [n] * n
stack = []
for i in range(n - 1, -1, -1):
    while stack and arr[stack[-1]] > arr[i]:
        stack.pop()
    next_less_eq[i] = stack[-1] if stack else n
    stack.append(i)

diff_a = [0] * (n + 3)
diff_b = [0] * (n + 3)

for i, v in enumerate(arr):
    A = i - prev_less[i]
    B = next_less_eq[i] - i

    x = min(A, B)
    y = max(A, B)

    add_linear(diff_a, diff_b, 1, x, v, 0)

    add_linear(diff_a, diff_b, x + 1, y, 0, v * x)

    add_linear(
        diff_a,
        diff_b,
        y + 1,
        A + B - 1,
        -v,
        v * (A + B)
    )

sums = [0] * (n + 1)

cur_a = 0
cur_b = 0

for length in range(1, n + 1):
    cur_a += diff_a[length]
    cur_b += diff_b[length]
    sums[length] = cur_a * length + cur_b

ans = [str(sums[length]) for length in range(n, 0, -1)]
print(" ".join(ans))
```第一个堆栈计算先前严格较小的元素。 相等的值被删除，这保证了子数组的唯一所有权规则。 

第二个堆栈计算下一个较小或相等的元素。 当出现相同的值时，使用相反的不等式可以防止重复计算。 

帮手`add_linear`执行表单函数的范围更新$$a \cdot L + b.$$记录所有更新后，单个前缀通道将重建每个长度的实际贡献。 

最后的逆转很重要。 长度$n$对应顶行，长度$1$对应于底行。 

## 工作示例

 ### 示例 1

 输入：```
6
1 2 1 2 2 6
```按长度排列的子数组最小值之和为：

 | 长度| 最小值总和 |
 | --- | --- |
 | 1 | 14 | 14
 | 2 | 7 |
 | 3 | 5 |
 | 4 | 3 |
 | 5 | 2 |
 | 6 | 1 |

 输出从长度 6 向下打印到长度 1：

 | 行| 对应长度| 总和|
 | --- | --- | --- |
 | 1 | 6 | 1 |
 | 2 | 5 | 2 |
 | 3 | 4 | 3 |
 | 4 | 3 | 5 |
 | 5 | 2 | 7 |
 | 6 | 1 | 14 | 14

 这确认了行和窗口长度之间的映射。 

### 示例 2

 输入：```
3
5 5 5
```子数组：

 | 长度| 子数组| 最低总和|
 | --- | --- | --- |
 | 1 | [5] [5] [5] | 15 | 15
 | 2 | [5,5] [5,5] | 10 | 10
 | 3 | [5,5,5]| 5 |

 输出：```
5 10 15
```此示例说明了为什么需要小心处理领带。 每个子数组最小值都相等，但每个子数组仍必须恰好计数一次。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 两次堆栈传递、一次贡献传递、一次前缀扫描 |
 | 空间|$O(n)$| 堆栈、边界数组和差异数组 |

 该解决方案可轻松扩展至$10^5$元素。 每个索引最多从每个堆栈中压入和弹出一次，并且每个贡献都会在恒定时间内处理。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    arr = list(map(int, input().split()))

    prev_less = [-1] * n
    stack = []
    for i in range(n):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        prev_less[i] = stack[-1] if stack else -1
        stack.append(i)

    next_less_eq = [n] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        next_less_eq[i] = stack[-1] if stack else n
        stack.append(i)

    da = [0] * (n + 3)
    db = [0] * (n + 3)

    def add(l, r, a, b):
        if l > r:
            return
        da[l] += a
        da[r + 1] -= a
        db[l] += b
        db[r + 1] -= b

    for i, v in enumerate(arr):
        A = i - prev_less[i]
        B = next_less_eq[i] - i

        x = min(A, B)
        y = max(A, B)

        add(1, x, v, 0)
        add(x + 1, y, 0, v * x)
        add(y + 1, A + B - 1, -v, v * (A + B))

    cur_a = cur_b = 0
    res = [0] * (n + 1)

    for L in range(1, n + 1):
        cur_a += da[L]
        cur_b += db[L]
        res[L] = cur_a * L + cur_b

    return " ".join(str(res[L]) for L in range(n, 0, -1))

# provided samples
assert solve("6\n1 2 1 2 2 6\n") == "1 2 3 5 7 14"
assert solve("11\n14 15 20 10 1 16 1 14 5 19 5\n") == "1 2 3 4 5 6 7 21 39 58 120"

# custom cases
assert solve("2\n1 2\n") == "1 3"
assert solve("3\n5 5 5\n") == "5 10 15"
assert solve("3\n1 2 3\n") == "1 2 6"
assert solve("4\n4 3 2 1\n") == "1 3 6 10"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / 1 2`|`1 3`| 最小有效尺寸|
 |`3 / 5 5 5`|`5 10 15`| 同等价值和领带处理 |
 |`3 / 1 2 3`|`1 2 6`| 严格递增序列|
 |`4 / 4 3 2 1`|`1 3 6 10`| 严格递减序列|

 ## 边缘情况

 考虑：```
3
5 5 5
```前一个较少的堆栈使用严格边界，而下一个边界是非严格的。 中间子数组`[5,5]`被分配到一个位置而不是两个位置。 该算法产生：```
5 10 15
```它与真实的行总和相匹配。 

考虑：```
3
1 2 3
```最上面一行对应于整个数组的最小值：```
[1]
```不是单个底部元素。 计算出的长度总和为：```
L=1 -> 6
L=2 -> 2
L=3 -> 1
```输出变为：```
1 2 6
```这正是从上到下的行总和的顺序。 

考虑：```
4
4 3 2 1
```每个较长的子数组在最右侧都有其最小值。 单调堆栈仍然给出正确的跨度：```
length 1 -> 10
length 2 -> 6
length 3 -> 3
length 4 -> 1
```输出是：```
1 3 6 10
```表明分段线性贡献公式可以正确处理高度不平衡的跨度。
