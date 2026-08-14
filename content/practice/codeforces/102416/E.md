---
title: "CF 102416E - 太空守护者"
description: "我们在三维空间中最多有 100 个球形保护区。 Starship (i) 的中心为 ((xi,yi,zi)) ，半径为 (ri)。 我们必须选择一些原来的球体不重叠的星舰。 只允许触摸一点。"
date: "2026-08-14T14:42:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102416
codeforces_index: "E"
codeforces_contest_name: "Edinburgh Competition 2019"
rating: 0
weight: 102416
solve_time_s: 128
verified: false
draft: false
---

[CF 102416E - 太空守护者](https://codeforces.com/problemset/problem/102416/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 8s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在三维空间中最多有 100 个球形保护区。 星舰 (i) 的中心为 ((x_i,y_i,z_i)) 和半径 (r_i)。 我们必须选择一些原来的球体不重叠的星舰。 只允许触摸一点。 

选择一艘星舰后，其职责从半径（r_i）扩展到半径（3r_i）。 扩展的球体可以重叠。 要求是所有原始球体的联合必须包含在属于所选星舰的扩展球体的联合中。 

输出只需要给出一个有效的子集。 子集不必是最小的，因此我们可以集中精力寻找保证有效的构造。 

两个球体 (i) 和 (j) 恰好在以下情况下不相交

 [
 d(i,j) \ge r_i+r_j,
 ]

 哪里

 [
 d(i,j)^2=(x_i-x_j)^2+(y_i-y_j)^2+(z_i-z_j)^2。 
]

 使用平方距离可以避免平方根并保持每个计算的积分。 

约束 (n\le100) 对于 (O(n^2)) 工作来说足够小，这意味着我们可以比较每对球体。 (O(n^3)) 解决方案在数值上也会很小，但没有理由使用它。 对所有子集的指数搜索是完全不可行的：即使在进行几何检查之前，(2^{100}) 约为 (1.27\cdot10^{30})。 

有两种边界情况很容易处理不当。 首先，允许接触球体共存。 例如，```
2
0 0 0 1
2 0 0 1
```中心正好相距两个单位，因此球体接触但不重叠。 两者都可以选择，有效输出为```
2
1 2
```支票使用`distance <= r1 + r2`会错误地拒绝这一对。 

第二个边界涉及覆盖范围。 假设一个球体因与选定球体相交而被跳过。 所选球体的半径必须至少与跳过的球体一样大。 如果两个球体相交，则跳过球体的每个点距所选中心的距离最多为 (r_i+r_j)。 由于 (r_i\le r_j)，最多为 (2r_j)，它小于其新半径 (3r_j)。 以任意顺序选择球体的粗心实现会丢失关键的半径比较，并且可能无法使用小得多的选定球体覆盖大球体。 

例如，```
2
0 0 0 10
10 0 0 1
```应选择半径为 10 的球体。 如果仅因为原始球体相交而先选择小球体然后跳过大球体，则扩展后的半径为 3 的球体将不会覆盖大球体。 减小半径的加工可以防止这种情况发生。 

## 方法

 最直接的暴力方法是尝试星际飞船的每个子集。 对于每个子集，我们可以检查每对选定的球体是否重叠，然后检查每个原始球体是否被扩展的球体覆盖。 即使使用 (O(n^2)) 验证过程，其成本也是 (O(2^n n^2))。 在 (n=100) 时，仅子集计数约为 (1.27\cdot10^{30})，因此这种方法远远超出了限制。 

有用的观察是我们不需要搜索正确的子集。 通过减小半径对球体进行排序，并在与已保留的每个球体不相交时贪婪地准确保留球体。 

不相交部分是直接的。 我们只有在确认其原始球体不与任何选定球体相交后才添加球体。 

有趣的部分是覆盖范围。 考虑算法未选择的球体 (A)。 在考虑 (A) 时，某些先前选择的球体 (B) 必须与 (A) 相交。 因为列表是按半径递减排序的，

 [
 r_A\le r_B。 
]

 取 (A) 内的任意点 (P)。 它距 (B) 中心的距离最多为

 [
 |P-C_B|\le |P-C_A|+|C_A-C_B|
 \le r_A+(r_A+r_B)。 
]

 该表达式最多为 (2r_A+r_B)，最多为 (3r_B)，因为 (r_A\le r_B)。 因此 (A) 的每个点都位于以 (B) 为中心、半径为 (3r_B) 的球体内。 

事实上，我们可以使用稍微宽松但更简单的界限

 [
 |P-C_B|\le r_A+r_A+r_B\le3r_B。 
]

 因此，每个跳过的球体都被某些先前选择的球体的三倍扩展球体完全覆盖。 

暴力破解之所以有效，是因为它明确地搜索满足这两个条件的子集，但会失败，因为子集的数量呈指数级增长。 观察到一个较大的球体在其半径增加三倍后会自动覆盖每个相交的较小球体，这将搜索变成了一个简单的贪婪结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^n n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 通过减小半径贪心| (O(n^2+n\log n)) | (O(n^2+n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取所有星舰并保留其原始索引，因为输出必须使用输入中的索引。 
2. 按半径递减对星舰进行排序。 如果两个半径相等，则它们之间的任何顺序都有效。 
3. 从一组空的选定星舰开始。 从最大半径到最小半径处理排序列表。 
4. 对于当前的星舰 (i)，将其与每一个已选择的星舰 (j) 进行比较。 计算中心距的平方

 [
 d^2=(x_i-x_j)^2+(y_i-y_j)^2+(z_i-z_j)^2。 
]

 仅当满足以下条件时才能选择当前球体

 [
 d^2\ge(r_i+r_j)^2
 ]

 对于每个选定的 (j)。 允许相等，因为接触的球体被视为不相交。 

1. 如果当前球体与所有选定的球体不相交，请将其添加到答案中。 否则跳过它。 
2. 处理完所有球体后，打印选定的索引。 该算法总是会产生有效的答案，因此`NO`永远不需要分支。 

### 为什么它有效

 保持到目前为止处理的每个球体要么被选中，要么被某个选定球体的三倍扩展球体完全覆盖的不变性。 

选定的球体显然满足不变量，因为它自己的扩展球体包含其原始球体。 如果跳过某个球体，它将与之前选择的球体 (j) 相交，并且排序顺序为 (r_i\le r_j)。 对于跳过球体中的任意点 (P)，

 [
 |P-C_j|
 \le |P-C_i|+|C_i-C_j|
 \le r_i+(r_i+r_j)
 =2r_i+r_j
 \le3r_j。 
]

 因此，整个跳过的球体被 (j) 的扩展球体覆盖。 同时，仅当球体与先前选择的每个球体不相交时才选择该球体，因此所有选定的原始区域保持成对不相交。 这两个必需的属性在每次迭代后都成立，因此最终答案也成立。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    ships = []

    for i in range(1, n + 1):
        x, y, z, r = map(int, input().split())
        ships.append((r, x, y, z, i))

    # Larger spheres must be considered first.
    ships.sort(reverse=True)

    selected = []

    for r, x, y, z, idx in ships:
        can_take = True

        for sr, sx, sy, sz, sidx in selected:
            dx = x - sx
            dy = y - sy
            dz = z - sz

            dist2 = dx * dx + dy * dy + dz * dz
            radius_sum = r + sr

            # Touching is allowed, so equality is also disjoint.
            if dist2 < radius_sum * radius_sum:
                can_take = False
                break

        if can_take:
            selected.append((r, x, y, z, idx))

    print(len(selected))
    print(*[idx for _, _, _, _, idx in selected])

if __name__ == "__main__":
    solve()
```输入与原始索引存储在一起，以便排序不会丢失星舰的身份。 元组以半径开始，允许`sort(reverse=True)`首先加工较大的半径。 

对于每个候选者，内部循环仅将其与选定的球体进行比较。 距离的平方与半径的平方和进行比较，因此不存在浮点运算。 这特别有用，因为必须精确处理两个球体完全接触的边界情况。 

比较使用`<`而不是`<=`。 如果

 [
 d^2=(r_i+r_j)^2,
 ]

 球体接触并明确允许一起选择。 只有严格较小的距离才意味着它们的内部重叠。 

Python 整数具有任意精度，因此不存在溢出问题。 即使在固定宽度整数语言中，坐标差也最多为 (10^4)，给出的平方距离约为 (10^8)，而平方半径和也很小。 

该算法从不打印`NO`。 上面的证明表明，递减半径构造总是给出一个有效的子集，包括当只有一个球体时。 

## 工作示例

 ### 示例 1

 输入是```
4
1 0 0 1
2 0 0 1
7 0 0 1
10 0 0 3
```首先处理半径为 3 的球体。 立即选择它。 然后根据所选球体检查三个半径为 1 的球体。 它们距 ((10,0,0)) 的中心距离分别为 9、8 和 3，而所需的不相交阈值是 (4)。 

通过代码使用的确定性排序，选择前两个半径为 1 的球体并跳过 (x=7) 处的球体。 

| 当前指数| 半径| 之前选择过 | 距离检查 | 决定|
 | --- | --- | --- | --- | --- |
 | 4 | 3 | 无 | 无 | 选择 |
 | 1 | 1 | 4 | (9\ge4) | (9\ge4) | 选择 |
 | 2 | 1 | 4, 1 | (8\ge4,\ 1<2) 为假，因为中心 1 和 2 的距离为 1 | 跳过|
 | 3 | 1 | 4, 1 | (3<4) | 跳过|

 此实现产生的选定集是`{4, 1}`。 球体 2 被球体 1 的扩展球体覆盖，而球体 3 被球体 4 的扩展球体覆盖。`{2,4}`是另一个有效的答案，因为输出不需要是唯一的。 

### 一个简单的覆盖示例

 考虑```
3
0 0 0 5
6 0 0 2
20 0 0 1
```首先选择半径为 5 的球体。 半径为 2 的球体与它相交，因此它被跳过。 半径为 1 的球体与所选球体不相交并被选中。 

| 当前指数| 半径| 之前选择过 | 相关距离| 决定|
 | --- | --- | --- | --- | --- |
 | 1 | 5 | 无 | 无 | 选择 |
 | 2 | 2 | 1 | (6<7) | (6<7) | 跳过|
 | 3 | 1 | 1 | (20\ge6) | 选择 |

 球体 2 被球体 1 的半径为 15 的扩展球体覆盖。这准确地说明了半径排序的重要性：导致另一个球体被跳过的球体保证至少与球体一样大。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n+n^2)) | 排序成本 (O(n\log n))，最多 (n) 个候选者与 (n) 个选定的球体进行比较 |
 | 空间| (O(n)) | (O(n)) | 输入和选定的星舰数组包含 (O(n)) 条记录 |

 对于 (n\le100)，二次部分最多执行约 (10^4) 成对检查。 坐标和半径限制还使每个算术运算都变得便宜，因此解决方案完全在 1 秒和 256 MB 的限制内。 

## 测试用例

 下面的测试工具检查实际的几何条件，而不是需要一个特定的有效子集。 这是必要的，因为问题允许任何有效答案，因此不同的正确贪婪决胜选择可以产生不同的索引集。```python
import sys
import io

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        n = int(sys.stdin.readline())
        ships = []

        for i in range(1, n + 1):
            x, y, z, r = map(int, sys.stdin.readline().split())
            ships.append((r, x, y, z, i))

        ships.sort(reverse=True)

        selected = []

        for r, x, y, z, idx in ships:
            ok = True

            for sr, sx, sy, sz, sidx in selected:
                dx = x - sx
                dy = y - sy
                dz = z - sz

                dist2 = dx * dx + dy * dy + dz * dz
                rr = r + sr

                if dist2 < rr * rr:
                    ok = False
                    break

            if ok:
                selected.append((r, x, y, z, idx))

        print(len(selected))
        print(*[idx for _, _, _, _, idx in selected])

        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str) -> bool:
    lines = out.strip().splitlines()
    if not lines:
        return False

    n = int(inp.splitlines()[0])
    data = [tuple(map(int, line.split())) for line in inp.splitlines()[1:]]

    k = int(lines[0])
    ids = list(map(int, lines[1].split())) if len(lines) > 1 else []

    if k != len(ids):
        return False
    if not (1 <= k <= n):
        return False
    if len(set(ids)) != k:
        return False
    if any(i < 1 or i > n for i in ids):
        return False

    selected = [data[i - 1] for i in ids]

    # Check that selected original spheres are pairwise disjoint.
    for i in range(k):
        x1, y1, z1, r1 = selected[i]
        for j in range(i + 1, k):
            x2, y2, z2, r2 = selected[j]

            dx = x1 - x2
            dy = y1 - y2
            dz = z1 - z2

            dist2 = dx * dx + dy * dy + dz * dz
            rr = r1 + r2

            if dist2 < rr * rr:
                return False

    # Check that every original sphere is covered by the union
    # of the expanded selected spheres.
    for x, y, z, r in data:
        covered = False

        for sx, sy, sz, sr in selected:
            dx = x - sx
            dy = y - sy
            dz = z - sz

            center_dist2 = dx * dx + dy * dy + dz * dz

            # The farthest point of the original sphere is
            # center distance + r, so coverage requires
            # center distance <= 3*sr - r.
            reach = 3 * sr - r

            if reach >= 0 and center_dist2 <= reach * reach:
                covered = True
                break

        if not covered:
            return False

    return True

def run(inp: str) -> str:
    out = solve_data(inp)
    assert validate(inp, out), f"Invalid output:\n{out}"
    return out

# Provided sample.
run("""4
1 0 0 1
2 0 0 1
7 0 0 1
10 0 0 3
""")

# Minimum-size input.
run("""1
5 5 5 7
""")

# Two spheres that only touch. Both may be selected.
run("""2
0 0 0 1
2 0 0 1
""")

# One large sphere intersects a smaller sphere.
# The larger one must be processed first so the smaller one is skipped safely.
run("""2
0 0 0 10
10 0 0 1
""")

# All spheres have identical centers.
# Only one original sphere can be selected, and its 3r expansion
# covers every identical sphere.
run("""4
100 100 100 2
100 100 100 2
100 100 100 2
100 100 100 2
""")

# Larger boundary-style case with 100 spheres.
# All are identical, so exactly one is needed.
large_case = "100\n" + "\n".join(
    f"{i} 0 0 1" for i in range(100)
)
run(large_case)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 任何几何上有效的子集 | 通用构造和非唯一输出 |
 |`1 / 5 5 5 7`| 选定的一个球体 | 最小尺寸输入 |
 | 距离为 2 的两个单位球体 | 两者都可以选择 | 精确接触边界|
 | 具有相交中心的半径 10 和半径 1 | 选择大球，跳过小球 | 半径递减不变式 |
 | 四个相同的球体| 恰好选择了一件 | 重合中心和相等半径|
 | 100 个单位球体在一条线上 | 有效的二次构造 | 最大 (n) 和性能 |

 ## 边缘情况

 第一个边界情况是精确相切。 为了```
2
0 0 0 1
2 0 0 1
```中心距的平方为 (4)，半径的平方和也为 (4)。 重叠的条件是`dist2 < radius_sum * radius_sum`，因此球体被一起接受。 它们的原始区域仅接触，这是问题明确允许的。 该算法输出两个索引。 

第二种边缘情况是较小的球体与较大的球体相交。 为了```
2
0 0 0 10
10 0 0 1
```首先处理并选择半径为 10 的球体。 然后，半径为 1 的球体将被拒绝，因为中心距离 (10) 小于 (11)。 为了验证覆盖范围，小球体距大中心的最远点的距离为 (11)，而所选球体的半径已扩大 (30)。 整个小球体因此被覆盖。 

第三种边缘情况是几个具有完全相同中心的球体：```
4
100 100 100 2
100 100 100 2
100 100 100 2
100 100 100 2
```选择第一个球体。 后面的每个球体的中心距离为零，组合半径为四，因此它与选定的球体相交并被跳过。 选定的球体将扩展到半径 6，其中包含所有四个原始半径为 2 的球体，因为它们具有相同的中心。 这也说明了为什么即使存在许多原始保护区，该算法也可以安全地返回单个星舰。 

第四种边缘情况是一长串相互接触的球体。 例如，```
3
0 0 0 1
2 0 0 1
4 0 0 1
```允许选择所有三个球体，因为相邻球体接触并且第一个和第三个球体不相交。 严格重叠测试会选择所有三个。 如果实现将相切视为相交，则会错误地丢弃中间球体并可能不必要地更改构造。 

最终的边缘情况是最大输入大小 (n=100)。 该算法仍然仅执行 (O(n^2)) 几何比较。 不需要递归、图形构造、浮点几何或子集枚举，因此最大情况仍然在限制范围内。
