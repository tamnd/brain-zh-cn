---
title: "CF 87E - Mogohu-Rea 偶像"
description: "我们在平面上有三个凸多边形。 我们必须从每个多边形中选择一个点，并且这三个所选点的平均值必须等于偶像的位置。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry"]
categories: ["algorithms"]
codeforces_contest: 87
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 73 (Div. 1 Only)"
rating: 2600
weight: 87
solve_time_s: 196
verified: true
draft: false
---

[CF 87E - Mogohu-Rea 偶像](https://codeforces.com/problemset/problem/87/E)

 **评分：** 2600
 **标签：** 几何
 **求解时间：** 3m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在平面上有三个凸多边形。 我们必须从每个多边形中选择一个点，并且这三个所选点的平均值必须等于偶像的位置。 

如果选择的祭坛点是$A, B, C$，而偶像就在这一点上$P$，条件是$$\frac{A+B+C}{3}=P$$可以重写为$$A+B+C=3P$$对于每一个独立的山丘，我们必须确定是否存在这样的三重点。 

多边形是凸的，最多可以有$5 \cdot 10^4$每个顶点。 山丘数量达$10^5$。 这些限制立即排除了在线性时间内处理针对每个多边形边的每个查询的任何操作。 甚至$O(nm)$已经在附近了$10^{10}$最坏情况下的操作。 

几何结构比原始尺寸更重要。 凸多边形在 Minkowski 和下表现得非常好，并且条件$$A+B+C=3P$$强烈建议将问题转化为凸多边形点查询。 

第一个微妙之处是祭坛位置不限于多边形顶点。 它们可能位于多边形内的任何位置，包括边界上。 仅检查顶点的解决方案是不正确的。 

考虑：```
Triangle 1: (0,0) (2,0) (0,2)
Triangle 2: (0,0) (2,0) (0,2)
Triangle 3: (0,0) (2,0) (0,2)
Hill: (1,1)
```重点$(1,1)$是可以实现的，因为我们可以选择所有三个祭坛点$(1,1)$，位于三角形内部。 将我们自己限制在顶点会错误地回答“否”。 

第二个微妙点是多边形可以相交甚至包含彼此。 不存在分离假设。 任何依赖不相交的方法都会立即失败。 

另一个容易犯的错误是忘记允许存在边界点。 假设一个多边形通过边缘端点进行退化贡献。```
Triangle 1: (0,0) (2,0) (0,2)
Triangle 2: (0,0) (2,0) (0,2)
Triangle 3: (0,0) (2,0) (0,2)
Hill: (0,0)
```选择所有三个祭坛$(0,0)$是有效的，所以正确答案是 YES。 严格的内部测试会错误地拒绝它。 

最后一个危险领域是精度。 坐标大为$5 \cdot 10^8$，并且 Minkowski 和可以暂时产生大约$1.5 \cdot 10^9$。 浮点几何在这里是不必要的，并且存在边界错误的风险。 整数叉积可以安全地适合 64 位有符号整数，因此整个解决方案应保持纯整数。 

## 方法

 暴力解释直接遵循定义。 对于每个山点$P$，我们会尝试确定是否存在点$A \in S_1$,$B \in S_2$， 和$C \in S_3$这样$$A+B+C=3P$$如果我们将自己限制在多边形顶点上，我们可以枚举所有顶点三元组，但这已经是不可能的了。 每个多边形可以有$5 \cdot 10^4$顶点，因此三元组的数量大致变为$$(5 \cdot 10^4)^3 \approx 10^{14}$$但这仍然无法解决真正的问题，因为有效的祭坛点并不限于顶点。 

关键的观察是该方程已经描述了闵可夫斯基和。 

定义$$S = S_1 + S_2 + S_3$$其中 Minkowski 和包含可表示为的每个点$$A+B+C$$和$A \in S_1$,$B \in S_2$,$C \in S_3$。 

那么查询就变得极其简单：$$3P \in S$$因此，我们不必为每个山丘解决新的几何存在问题，而是可以预先计算一次组合区域，并且每个查询都简化为凸多边形中的点测试。 

这工作得很好，因为凸多边形在闵可夫斯基和下是封闭的。 凸多边形的和又是凸多边形。 更好的是，可以使用边角合并技术在线性时间内计算凸多边形的 Minkowski 和。 

假设这三个多边形包含$n_1, n_2, n_3$顶点。 他们的闵可夫斯基和最多有$$n_1+n_2+n_3$$vertices after removing collinear redundancies. 这意味着我们可以在线性时间内构建最终的多边形，然后使用二分搜索点包含在对数时间内回答每个查询。 

暴力方法会失败，因为它会为每个查询独立地重复重建几何关系。 闵可夫斯基和视点将整个可行区域压缩为一个凸多边形。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(m \cdot n_1 n_2 n_3)$|$O(1)$| 太慢了 |
 | 最佳|$O(n_1+n_2+n_3+m\log N)$|$O(N)$| 已接受 |

 这里$N$是最终的闵可夫斯基和多边形的顶点数。 

## 算法演练

 1. 读取三个凸多边形。 

顶点已经按逆时针顺序给出，这正是 Minkowski-sum 算法所需要的。 
2. 旋转每个多边形，使其字典顺序最小的顶点排在最前面。 

这为每个多边形提供了规范的起始位置。 旋转后，边向量将按角度顺序出现在多边形周围。 
3. 将每个多边形转换为循环边序列。 

如果顶点是$p_0, p_1, \dots, p_{n-1}$，那么边是$$p_{i+1}-p_i$$最后有环绕。 
4. 使用边合并计算两个多边形的 Minkowski 和。 

从两个最小顶点的和开始。 然后同时走过边缘序列。 

在每一步中，比较当前边缘向量的叉积。 

如果叉积为正，则推进第一个多边形。 

如果为负，则推进第二个多边形。 

如果为零，则两者都前进。 

这在本质上与合并两个已排序的数组相同，只不过排序是按边缘角度排序的。 
5. 将三个多边形相加。 

首先计算$$T=S_1+S_2$$然后计算$$S=T+S_3$$6. 从生成的多边形中删除多余的共线顶点。 

连续的共线边不会影响形状，但会使点查询变得复杂。 
7. 对于每个山点$P$，将其缩放 3。 

可行性条件为$$3P \in S$$所以我们询问这一点$$Q=(3x,3y)$$8. 以对数时间执行凸多边形内的点测试。 

将第一个顶点固定为扇形三角剖分的原点。 

首先拒绝由第一条边和最后一条边形成的角度范围之外的点。 

然后二分查找包含查询点的三角形扇区。 

最后使用叉积检查该点是否位于该三角形内部。 
9. 如果该点位于 Minkowski 和多边形的内部或边界上，则打印 YES，否则打印 NO。 

### 为什么它有效

 闵可夫斯基总和$$S_1+S_2+S_3$$包含完全可以表示为的所有点$$A+B+C$$从每个多边形中选择一个点。 

偶像条件需要$$A+B+C=3P$$这意味着山在什么时候是可行的$3P$属于闵可夫斯基和多边形。 

因为每个多边形都是凸的，所以它们的闵可夫斯基和也是凸的。 边角合并算法通过以递增的角度顺序遍历支撑边来正确构建其边界。 凸多边形中的点查询是正确的，因为每个凸多边形都可以划分为共享公共锚顶点的非重叠三角形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]

def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])

def add(a, b):
    return (a[0] + b[0], a[1] + b[1])

def rotate_smallest(poly):
    idx = min(range(len(poly)), key=lambda i: (poly[i][0], poly[i][1]))
    return poly[idx:] + poly[:idx]

def compress(poly):
    res = []
    n = len(poly)

    for p in poly:
        while len(res) >= 2:
            a = res[-2]
            b = res[-1]
            if cross(sub(b, a), sub(p, b)) == 0:
                res.pop()
            else:
                break
        res.append(p)

    while len(res) >= 3:
        a = res[-2]
        b = res[-1]
        c = res[0]
        if cross(sub(b, a), sub(c, b)) == 0:
            res.pop()
        else:
            break

    return res

def minkowski(A, B):
    A = rotate_smallest(A)
    B = rotate_smallest(B)

    n = len(A)
    m = len(B)

    ea = [sub(A[(i + 1) % n], A[i]) for i in range(n)]
    eb = [sub(B[(i + 1) % m], B[i]) for i in range(m)]

    i = j = 0

    cur = add(A[0], B[0])
    res = [cur]

    while i < n or j < m:
        va = ea[i % n] if i < n else None
        vb = eb[j % m] if j < m else None

        if i == n:
            take_a = False
        elif j == m:
            take_a = True
        else:
            cr = cross(va, vb)
            if cr > 0:
                take_a = True
            elif cr < 0:
                take_a = False
            else:
                cur = add(cur, add(va, vb))
                res.append(cur)
                i += 1
                j += 1
                continue

        if take_a:
            cur = add(cur, va)
            i += 1
        else:
            cur = add(cur, vb)
            j += 1

        res.append(cur)

    res.pop()
    return compress(res)

def point_in_convex(poly, p):
    n = len(poly)

    if n == 1:
        return p == poly[0]

    if cross(sub(poly[1], poly[0]), sub(p, poly[0])) < 0:
        return False

    if cross(sub(poly[-1], poly[0]), sub(p, poly[0])) > 0:
        return False

    l = 1
    r = n - 1

    while r - l > 1:
        mid = (l + r) // 2

        if cross(sub(poly[mid], poly[0]), sub(p, poly[0])) >= 0:
            l = mid
        else:
            r = mid

    a = poly[0]
    b = poly[l]
    c = poly[(l + 1) % n]

    return cross(sub(b, a), sub(p, a)) >= 0 and \
           cross(sub(c, b), sub(p, b)) >= 0 and \
           cross(sub(a, c), sub(p, c)) >= 0

def read_poly():
    n = int(input())
    return [tuple(map(int, input().split())) for _ in range(n)]

p1 = read_poly()
input()

p2 = read_poly()
input()

p3 = read_poly()
input()

sum12 = minkowski(p1, p2)
total = minkowski(sum12, p3)

m = int(input())

out = []

for _ in range(m):
    x, y = map(int, input().split())
    q = (3 * x, 3 * y)

    if point_in_convex(total, q):
        out.append("YES")
    else:
        out.append("NO")

print("\n".join(out))
```实现直接遵循数学结构。 

这`rotate_smallest`函数标准化多边形表示。 仅当两个多边形都从其字典顺序最小的顶点开始时，闵可夫斯基边缘合并才可以正常工作。 

这`minkowski`函数执行线性合并。 每个多边形都提供按角度排序的边缘向量的循环序列。 合并逻辑推进使用叉积检测到的具有较小极角的边缘。 当两条边平行且指向同一方向时，两条边会一起消耗。 

结果可能包含不必要的共线顶点。 这`compress`函数使用方向检查来删除它们。 这很重要，因为点查询假设严格的凸扇形结构。 

点包含测试仅使用整数算术。 多边形被视为以扇形为根的扇形`poly[0]`。 二分搜索识别包含查询点的唯一三角形扇区，然后三个方向测试确定该点是位于边界内部还是边界上。 

一个微妙的细节是非严格不等式的使用。 根据声明，边界点是有效的，因此每个遏制测试都必须接受零交叉产品。 

另一个微妙的点是溢出安全。 Python 整数是任意精度，但即使在 C++ 中，所有计算也适合有符号 64 位整数，因为坐标幅度大致保持在以下值$10^{18}$叉积内相乘之后。 

## 工作示例

 ### 示例 1

 输入：```
3
0 0
1 0
1 1

4
8 8
5 5
6 4
8 4

3
-1 -1
-3 -1
-2 -2

5
0 0
2 1
7 1
1 1
5 3
```该算法首先构建 Minkowski 和多边形。 

一个成功的查询是 hill$(2,1)$。 

我们测试一下这个点：$$Q=(6,3)$$声明中选择的祭坛点是：$$(1,0), (7,5), (-2,-2)$$他们的总和是：$$(1,0)+(7,5)+(-2,-2)=(6,3)$$这等于$3(2,1)$。 

| 查询山 | 缩放查询 | 闵可夫斯基和的内部 | 回答 |
 | --- | --- | --- | --- |
 | (0,0) | (0,0) | (0,0) | (0,0) | 没有 | 否 |
 | (2,1) | (6,3) | 是的 | 是 |
 | (7,1)| (21,3) | 没有 | 否 |
 | (1,1) | (3,3) | 是的 | 是 |
 | (5,3) | (15,9) | (15,9) | 没有 | 否 |

 这表明问题的集中减少。 我们从不明确地搜索祭坛三元组。 整个可行区域被编码为一个凸多边形。 

### 自定义示例

 考虑三个相同的单位正方形：```
4
0 0
1 0
1 1
0 1
```他们的闵可夫斯基和变成了平方：```
0 ≤ x ≤ 3
0 ≤ y ≤ 3
```现在查询山$(1,1)$。 

| 步骤| 价值|
 | --- | --- |
 | 山| (1,1) |
 | 缩放点| (3,3) |
 | 闵可夫斯基界限 | 0 ≤ x ≤ 3, 0 ≤ y ≤ 3 |
 | 纳入结果 | 边界点|
 | 回答 | 是 |

 该跟踪确认边界点被正确接受。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n_1+n_2+n_3+m\log N)$| 线性 Minkowski 构造和对数点查询 |
 | 空间|$O(N)$| 存储最终的凸多边形 |

 多边形顶点总数最多为$1.5 \cdot 10^5$，因此线性 Minkowski 构造很容易足够快。 每个$10^5$山查询仅花费对数时间，完全符合时间限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def cross(a, b):
        return a[0] * b[1] - a[1] * b[0]

    def sub(a, b):
        return (a[0] - b[0], a[1] - b[1])

    def add(a, b):
        return (a[0] + b[0], a[1] + b[1])

    def rotate_smallest(poly):
        idx = min(range(len(poly)), key=lambda i: (poly[i][0], poly[i][1]))
        return poly[idx:] + poly[:idx]

    def compress(poly):
        res = []

        for p in poly:
            while len(res) >= 2:
                a = res[-2]
                b = res[-1]

                if cross(sub(b, a), sub(p, b)) == 0:
                    res.pop()
                else:
                    break

            res.append(p)

        return res

    def minkowski(A, B):
        A = rotate_smallest(A)
        B = rotate_smallest(B)

        n = len(A)
        m = len(B)

        ea = [sub(A[(i + 1) % n], A[i]) for i in range(n)]
        eb = [sub(B[(i + 1) % m], B[i]) for i in range(m)]

        i = j = 0

        cur = add(A[0], B[0])
        res = [cur]

        while i < n or j < m:
            va = ea[i % n] if i < n else None
            vb = eb[j % m] if j < m else None

            if i == n:
                take_a = False
            elif j == m:
                take_a = True
            else:
                cr = cross(va, vb)

                if cr > 0:
                    take_a = True
                elif cr < 0:
                    take_a = False
                else:
                    cur = add(cur, add(va, vb))
                    res.append(cur)
                    i += 1
                    j += 1
                    continue

            if take_a:
                cur = add(cur, va)
                i += 1
            else:
                cur = add(cur, vb)
                j += 1

            res.append(cur)

        res.pop()
        return compress(res)

    def point_in_convex(poly, p):
        n = len(poly)

        if cross(sub(poly[1], poly[0]), sub(p, poly[0])) < 0:
            return False

        if cross(sub(poly[-1], poly[0]), sub(p, poly[0])) > 0:
            return False

        l, r = 1, n - 1

        while r - l > 1:
            mid = (l + r) // 2

            if cross(sub(poly[mid], poly[0]), sub(p, poly[0])) >= 0:
                l = mid
            else:
                r = mid

        a = poly[0]
        b = poly[l]
        c = poly[(l + 1) % n]

        return cross(sub(b, a), sub(p, a)) >= 0 and \
               cross(sub(c, b), sub(p, b)) >= 0 and \
               cross(sub(a, c), sub(p, c)) >= 0

    def read_poly():
        n = int(input())
        return [tuple(map(int, input().split())) for _ in range(n)]

    p1 = read_poly()
    input()

    p2 = read_poly()
    input()

    p3 = read_poly()
    input()

    total = minkowski(minkowski(p1, p2), p3)

    m = int(input())

    ans = []

    for _ in range(m):
        x, y = map(int, input().split())

        if point_in_convex(total, (3 * x, 3 * y)):
            ans.append("YES")
        else:
            ans.append("NO")

    return "\n".join(ans)

# sample 1
assert run("""3
0 0
1 0
1 1

4
8 8
5 5
6 4
8 4

3
-1 -1
-3 -1
-2 -2

5
0 0
2 1
7 1
1 1
5 3
""") == """NO
YES
NO
YES
NO"""

# minimum triangles
assert run("""3
0 0
1 0
0 1

3
0 0
1 0
0 1

3
0 0
1 0
0 1

1
0 0
""") == "YES"

# boundary point
assert run("""4
0 0
1 0
1 1
0 1

4
0 0
1 0
1 1
0 1

4
0 0
1 0
1 1
0 1

1
1 1
""") == "YES"

# outside point
assert run("""4
0 0
1 0
1 1
0 1

4
0 0
1 0
1 1
0 1

4
0 0
1 0
1 1
0 1

1
2 2
""") == "NO"

# negative coordinates
assert run("""3
-1 -1
0 -1
-1 0

3
-1 -1
0 -1
-1 0

3
-1 -1
0 -1
-1 0

1
-1 -1
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三个相同的最小三角形| 是 | 最小的有效多边形 |
 | 平方和边界查询 | 是 | 边界包含 |
 | 平方和之外的查询 | 否 | 正确拒绝|
 | 负坐标三角形| 是 | 有符号算术正确性 |

 ## 边缘情况

 考虑边界包含情况：```
3
0 0
1 0
0 1

3
0 0
1 0
0 1

3
0 0
1 0
0 1

1
0 0
```缩放后的查询点仍然是$(0,0)$。 该点恰好位于闵可夫斯基和多边形的顶点。 多边形内的点测试接受它，因为每个方向检查都使用`>= 0`而不是`> 0`。 该算法正确地打印 YES。 

现在考虑一个仅内点起作用的示例：```
3
0 0
2 0
0 2

3
0 0
2 0
0 2

3
0 0
2 0
0 2

1
1 1
```缩放后的查询变为$(3,3)$。 没有三重顶点之和为$(3,3)$，因此任何仅顶点方法都会失败。 但闵可夫斯基和包含所有凸组合，而不仅仅是顶点和。 自从$(1,1)$位于每个三角形内，选择那里的所有三个祭坛点给出$$(1,1)+(1,1)+(1,1)=(3,3)$$并且算法正确输出 YES。 

最后，考虑相交的多边形：```
3
0 0
2 0
0 2

3
1 0
3 0
1 2

3
0 1
2 1
0 3

1
1 1
```多边形严重重叠。 该算法不依赖于任何地方的不相交。 闵可夫斯基和对于任意凸集仍然有效，因此相同的构造和查询逻辑工作不变。
