---
title: "CF 102302C - 矩形"
description: "坐标平面上最多有 2000 个不同的点。 有效的矩形必须使用其中的四个点作为其角，其边必须是水平或垂直的，并且矩形内部或其四个边之一上不得有其他给定点。"
date: "2026-08-13T23:16:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102302
codeforces_index: "C"
codeforces_contest_name: "2019 USP-ICMC"
rating: 0
weight: 102302
solve_time_s: 138
verified: true
draft: false
---

[CF 102302C - 矩形](https://codeforces.com/problemset/problem/102302/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 坐标平面上最多有 2000 个不同的点。 有效的矩形必须使用其中的四个点作为其角，其边必须是水平或垂直的，并且矩形内部或其四个边之一上不得有其他给定点。 

任务是计算满足这些条件的每个不同的矩形。 实际坐标值可以大到 (10^9)，但它们的绝对大小无关。 重要的是哪些坐标相等以及哪些坐标位于其他坐标之间。 

对于 (N \le 2000)，(O(N^2)) 解决方案是一个自然目标。 大约有两百万个无序点对，因此用恒定的工作量处理每对点是可行的。 在最坏的情况下， (O(N^3)) 解决方案可能已经需要大约 (4\cdot10^9) 次操作，这对于一秒的限制来说太多了。 四点组合的完整 (O(N^4)) 枚举更是遥不可及。 (10^9) 的坐标界限也意味着我们无法分配直接由原始坐标索引的网格。 

第一个边缘情况是少于四个点。 例如，输入`1 / 5 7`仅包含一个点，因此答案为 0。假设每一对最终都可以定义一个矩形的解决方案可能会意外地尝试访问不存在的角点。 

另一种边缘情况是在一条垂直或水平线上有许多点。 例如这四点`(0,0)`,`(0,1)`,`(0,2)`,`(0,3)`不能形成矩形，所以答案为 0。仅检查四个坐标是否独立出现是不够的，因为四个角必须有两个不同的 x 坐标和两个不同的 y 坐标。 

空性状态是微妙的部分。 考虑`(0,0)`,`(2,0)`,`(0,2)`,`(2,2)`,`(1,1)`。 四个角点存在，但答案为 0，因为`(1,1)`位于矩形内部。 仅检查四个角是否存在的解决方案会错误地计算它。 

边界上的点也会导致同样的问题。 和`(0,0)`,`(2,0)`,`(0,2)`,`(2,2)`,`(1,0)`，四个角都存在，但答案又是 0，因为`(1,0)`位于底部边缘。 矩形必须恰好包含其闭合边界框中的四个角点。 

## 方法

 一种直接的方法是将每对点视为可能的左下角和右上角。 如果它们的x坐标和y坐标都不同，我们可以检查另外两个角点是否存在于哈希集中。 然后，我们扫描所有 (N) 个点，看看是否有任何点位于候选矩形的内部或边界上。 每个候选对的处理时间为 (O(N))，给出 (O(N^3)) 时间。 对于 (N=2000)，有 (\binom{2000}{2}=1,999,000) 对，每对扫描 2000 个点，得到大约 (3,998,000,000) 个点检查。 这种方法在逻辑上是正确的，但速度太慢了。 

暴力破解之所以有效，是因为矩形是由其左下角和右上角唯一确定的。 昂贵的部分不是识别角点，而是反复询问有多少给定点位于特定的轴对齐矩形内。 

关键的观察是该问题的答案可以预先计算。 只有坐标的相对顺序很重要，因此我们将所有不同的 x 坐标压缩为 (1,\ldots,X)，将所有不同的 y 坐标压缩为 (1,\ldots,Y)。 由于任一类型最多有 (N) 个不同的坐标，因此生成的网格最多有 (N^2) 个单元格。 

我们在每个占用的压缩坐标处放置一个 1 并构建一个二维前缀和。 一旦该表存在，就可以使用标准包含-排除公式在 (O(1)) 时间内获得任何闭合矩形内的点数。 

我们现在可以检查每对点。 按 x 坐标排序后，只有 y 坐标递增的对才能表示左下角和右上角。 我们检查另一个角是否存在。 如果所有四个角都存在，则整个矩形的前缀和必须恰好为 4。由于四个已知角已经贡献了四个点，因此总和大于 4 意味着某个附加点位于边缘内部或边缘上。 

这减少了从每个候选扫描 (N) 个点到恒定时间前缀和查询的昂贵部分。 该问题的公共参考实现使用相同的坐标压缩和二维前缀和策略。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N^3)) | (O(N)) | 太慢了|
 | 最佳| (O(N^2)) | (O(N^2)) | 已接受 |

 ## 算法演练

 1. 读取所有点并收集它们不同的 x 和 y 坐标。 对两个坐标列表进行排序，并为每个坐标分配一个从 1 开始的压缩索引。压缩会保留排序，因此当一个点的压缩坐标位于相应的压缩矩形内部时，该点在压缩之前正好位于矩形内部。 
2. 创建一个压缩的（Y\times X）网格，并在每个占用的单元格处放置 1。 无论原始坐标是否接近或大到（10^9），网格尺寸最多为（2000\times2000）。 
3. 将网格转换为二维前缀和数组。 对于每个压缩单元（（x，y）），其前缀值存储压缩坐标最多为（x）和（y）的输入点的数量。 具有角 ((x_1,y_1)) 和 ((x_2,y_2)) 的封闭矩形中的点之和为

[
 P(x_2,y_2)-P(x_1-1,y_2)-P(x_2,y_1-1)+P(x_1-1,y_1-1)。 
]
 4. 将每个压缩点存储在哈希集中。 这提供了恒定的平均时间检查是否存在所需的角点。 
5. 按 x 坐标和 y 坐标对压缩点进行排序。 按此顺序考虑每对点。 x 坐标相等的对不能是矩形的对角点，y 坐标不增加的对不能是左下角和右上角。 
6. 对于剩余的对((x_1,y_1))、((x_2,y_2))，检查((x_1,y_2))是否存在。 点 ((x_2,y_1)) 已经是选定点之一，因此与两个选定点和 ((x_1,y_2)) 一起，所有四个角都存在。 
7. 查询全封闭矩形的前缀和。 当结果为 4 时精确计数矩形。四个角保证贡献四个点，因此任何较大的值意味着内部或边缘上有不需要的点。 
8. 打印累计计数。 每个有效的矩形都只有一对左下角和右上角，因此它只被考虑一次。 

### 为什么它有效

 不变量是算法接受的每个候选点在其封闭边界框中恰好有四个给定点，并且这四个点形成所需的角点。 角点存在检查保证四个顶点都存在。 前缀和查询对矩形内部及其边界上的每个点进行计数，因此值恰好为 4 证明那里不存在第五个点。 相反，每个有效的矩形都有唯一的左下角和右上角对。 当处理该对时，找到另外两个角并且前缀和恰好为 4，因此对矩形进行计数。 因此，每个有效矩形都会被计算一次，并且不会计算无效矩形。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n = int(input())
    points = [tuple(map(int, input().split())) for _ in range(n)]

    if n < 4:
        print(0)
        return

    xs = sorted({x for x, _ in points})
    ys = sorted({y for _, y in points})

    x_id = {x: i + 1 for i, x in enumerate(xs)}
    y_id = {y: i + 1 for i, y in enumerate(ys)}

    nx = len(xs)
    ny = len(ys)
    width = nx + 1

    # Unsigned short is enough because every prefix sum is at most N <= 2000.
    pref = array('H', [0]) * ((ny + 1) * width)

    compressed = []
    present = set()

    for x, y in points:
        cx = x_id[x]
        cy = y_id[y]
        compressed.append((cx, cy))
        present.add((cx, cy))
        pref[cy * width + cx] = 1

    # Build the 2D prefix sum in-place.
    for y in range(1, ny + 1):
        base = y * width
        previous = base - width
        row_sum = 0

        for x in range(1, nx + 1):
            idx = base + x
            row_sum += pref[idx]
            pref[idx] = pref[previous + x] + row_sum

    compressed.sort()

    answer = 0

    for i in range(n):
        x1, y1 = compressed[i]

        for j in range(i + 1, n):
            x2, y2 = compressed[j]

            # Sorting gives x1 <= x2. Equal x cannot form a rectangle.
            if x1 == x2:
                continue

            # We need the first point to be the bottom-left corner.
            if y1 >= y2:
                continue

            # The missing fourth corner is (x1, y2).
            if (x1, y2) not in present:
                continue

            # Count all points in the closed rectangle.
            total = (
                pref[y2 * width + x2]
                - pref[(y1 - 1) * width + x2]
                - pref[y2 * width + (x1 - 1)]
                + pref[(y1 - 1) * width + (x1 - 1)]
            )

            if total == 4:
                answer += 1

    print(answer)

if __name__ == "__main__":
    solve()
```早期的`n < 4`check 处理最小的输入而不构建任何数据结构。 它不是正确性所必需的，但可以避免不必要的工作。 

坐标图将每个原始坐标转换为紧凑的整数索引。 x 和 y 的单独压缩使前缀和网格最多保持 (2001\times2001) 个单元，而不是使用原始坐标范围。 

前缀数组使用`array('H')`而不是 Python 整数。 前缀值永远不能超过 (N)，最多为 2000，因此无符号 16 位值就足够了。 这使网格的最大大小保持在 8 MB 左右，远低于 256 MB 内存限制。 

前缀和是逐行构建的。`row_sum`表示当前行中到目前为止看到的点数，而`pref[previous + x]`包含所有先前行的贡献。 将这两个值相加得到标准的二维前缀递归。 

这些点按压缩的 x 坐标排序。 对于每一对，相等的 x 坐标都会被拒绝，因为它们不能是轴对齐矩形的对角。 这`y1 >= y2`check 仅选择一个方向，因此同一个矩形永远不会从其右上和左下对反向计数。 

哈希集包含压缩的坐标对，因此检查丢失的角点可以避免转换回原始 (10^9) 比例坐标。 一旦知道了所有四个角，前缀和就会自动包括这四个点。 测试`total == 4`因此足以执行内部和边界限制。 

Python 整数是无界的，因此答案不会有溢出的风险。 即使矩形的最大可能数量最多也是 (\binom{2000}{4})，这是可以安全表示的。 

## 工作示例

 对于第一个样本，压缩后点已排列为`(1,1), (1,2), (2,1), (2,2), (3,1), (3,2)`。 

相关候选对如下所示。 

| 左下| 右上角| 缺角| 闭合矩形中的点 | 结果 |
 | --- | --- | --- | --- | --- |
 | (1,1) | (2,2) | (1,2) | 4 | 计数 |
 | (1,1) | (3,2) | (1,2) | 6 | 拒绝 |
 | (2,1) | (3,2) | (2,2) | 4 | 计数 |

 这对`(1,1)`和`(3,2)`具有所有四个角，但它还包含`(2,1)`和`(2,2)`，因此它的前缀和为 6。两个较小的矩形各恰好有 4 个点，得出答案 2。 

对于第二个示例，请考虑矩形的四个角和一个内点。```
5
0 0
2 0
0 2
2 2
1 1
```压缩后唯一可能的矩形有角`(1,1)`,`(3,1)`,`(1,3)`， 和`(3,3)`。 它的闭合矩形包含五个点。 

| 左下| 右上角| 缺角| 闭合矩形中的点 | 结果 |
 | --- | --- | --- | --- | --- |
 | (1,1) | (3,3) | (1,3) | 5 | 拒绝 |

 角点检查成功，但前缀和暴露了额外点`(1,1)`在原始坐标系中，所以答案为 0。这说明了为什么仅检查四个角是不够的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N^2)) | 最坏情况下，坐标压缩和前缀构造需要 (O(N^2))，对枚举需要 (O(N^2))。 |
 | 空间| (O(N^2)) | 压缩的前缀和网格最多有 (2001\times2001) 个条目。 |

 在 (N=2000) 处，前缀网格包含大约 400 万个单元，对枚举考虑大约 200 万对。 紧凑的 16 位前缀表示可保持较低的内存使用量，而预处理后会在恒定时间内检查每个候选矩形。 

## 测试用例```python
from array import array

def solve_data(inp: str) -> str:
    it = iter(inp.split())
    n = int(next(it))

    points = [(int(next(it)), int(next(it))) for _ in range(n)]

    if n < 4:
        return "0\n"

    xs = sorted({x for x, _ in points})
    ys = sorted({y for _, y in points})

    x_id = {x: i + 1 for i, x in enumerate(xs)}
    y_id = {y: i + 1 for i, y in enumerate(ys)}

    nx = len(xs)
    ny = len(ys)
    width = nx + 1

    pref = array('H', [0]) * ((ny + 1) * width)

    compressed = []
    present = set()

    for x, y in points:
        cx = x_id[x]
        cy = y_id[y]
        compressed.append((cx, cy))
        present.add((cx, cy))
        pref[cy * width + cx] = 1

    for y in range(1, ny + 1):
        base = y * width
        previous = base - width
        row_sum = 0

        for x in range(1, nx + 1):
            idx = base + x
            row_sum += pref[idx]
            pref[idx] = pref[previous + x] + row_sum

    compressed.sort()

    answer = 0

    for i in range(n):
        x1, y1 = compressed[i]

        for j in range(i + 1, n):
            x2, y2 = compressed[j]

            if x1 == x2 or y1 >= y2:
                continue

            if (x1, y2) not in present:
                continue

            total = (
                pref[y2 * width + x2]
                - pref[(y1 - 1) * width + x2]
                - pref[y2 * width + x1 - 1]
                + pref[(y1 - 1) * width + x1 - 1]
            )

            if total == 4:
                answer += 1

    return f"{answer}\n"

def run(inp: str) -> str:
    return solve_data(inp)

# Provided sample
assert run("""\
6
1 1
1 2
2 1
2 2
3 1
3 2
""") == "2\n", "sample 1"

# Minimum-size input
assert run("""\
1
5 7
""") == "0\n", "fewer than four points"

# Four corners at the coordinate boundaries
assert run("""\
4
0 0
1000000000 0
0 1000000000
1000000000 1000000000
""") == "1\n", "boundary coordinates"

# Extra points on and inside the rectangle
assert run("""\
6
0 0
2 0
0 2
2 2
1 0
1 1
""") == "0\n", "boundary and interior points"

# Maximum-size input, all points on one vertical line
points = "\n".join(f"0 {y}" for y in range(2000))
maximum_case = "2000\n" + points + "\n"
assert run(maximum_case) == "0\n", "maximum N with equal x coordinates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一点`(5,7)`| 0 | 最小尺寸输入且没有四个角 |
 | 使用 0 和 (10^9) | 四个角 1 | 坐标边界和坐标压缩|
 | 矩形加`(1,0)`和`(1,1)`| 0 | 边缘上和矩形内部的点 |
 | 2000点`(0,y)`| 0 | 最大值 (N)、相等的 x 坐标和内存处理 |

 ## 边缘情况

 对于少于四个点，输入```
1
5 7
```不包含可能的四个顶点集。 该算法在分配前缀网格之前立即返回 0。 这可以防止任何候选矩形必须存在的假设。 

对于共享一个坐标的点，请考虑```
4
0 0
0 1
0 2
0 3
```所有四个点都具有相同的 x 坐标。 排序后，每对都有`x1 == x2`，因此每对在角点查找之前都会被拒绝。 输出为0。 

对于矩形内的额外点，请考虑```
5
0 0
2 0
0 2
2 2
1 1
```这对`(0,0)`和`(2,2)`还有另一个角`(0,2)`， 和`(2,0)`已经存在，因此它到达前缀和查询。 闭合矩形包含 5 个点而不是 4 个点，导致候选人被拒绝。 输出为0。 

对于边缘上的额外点，请考虑```
5
0 0
2 0
0 2
2 2
1 0
```同样，所有四个角都存在。 矩形上的前缀和为 5，因为`(1,0)`包含在封闭边界内。 由于该算法正好需要 4 个点，因此它会拒绝矩形并输出 0。 

对于具有重复 x 坐标的最大输入，请使用 2000 个点`(0,0)`,`(0,1)`， 通过`(0,1999)`。 每个候选对都有相等的 x 坐标，因此对循环会拒绝所有候选对。 答案是 0，而前缀网格在一个方向上仍然只有 (1\times2001) 个占用坐标尺寸。 这在不依赖密集二维点分布的情况下练习了最大输入大小。
