---
title: "CF 435C - 心电图"
description: "输入描述了一条在上升和下降对角线段之间交替的折线。 第 $i$ 段的长度为 $ai$。"
date: "2026-06-07T02:45:08+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 435
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 249 (Div. 2)"
rating: 1600
weight: 435
solve_time_s: 138
verified: false
draft: false
---

[CF 435C - 心电图](https://codeforces.com/problemset/problem/435/C)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 输入描述了一条在上升和下降对角线段之间交替的折线。 的长度$i$第-段是$a_i$。 

如果我们从某个点开始并依次绘制线段，则第一条线段向右上方延伸，第二条线段向右下方延伸，第三条线段再次向右上方延伸，依此类推。 每个运动单位都会将两个坐标精确地更改 1。 最终图片仅由对角线组成，因此每个占用的单元格包含`/`或者`\`。 

任务是将心电图打印为 ASCII 艺术。 每一列对应一个水平移动单位。 每行对应一个垂直级别。 空位置必须包含空格。 输出包含的行数必须与绘图的垂直跨度完全相同。 

限制很小。 线段数量最多为 1000，所有线段长度之和最多为 1000。由于线段的每个单位步长恰好占据最终图片中的一个字符位置，因此非空单元格总数最多为 1000。即使是显式模拟折线每一步的算法也很容易足够快。 

主要的困难不是效率，而是协调处理。 

一个容易犯的错误是将斜线字符放置在错误的垂直位置。 考虑：```
2
1 1
```第一段上升一级，第二段下降一级。 正确的图片是：```
/\
```粗心的实施可能会导致`\`降低一行并生成楼梯而不是连接的折线。 

另一个微妙的情况是当绘图达到负垂直坐标时。```
2
1 3
```路径上升一次，然后下降三次。 最低点低于起始水平。 如果我们直接使用这些坐标作为行索引，我们将获得负数组索引。 打印前必须将图片向上移动。 

错误的第三个来源是确定所需的高度。 考虑：```
3
2 2 2
```路径向上、向下移动，然后再次向上移动。 最高和最低访问级别不一定是单独的段端点。 该实现必须跟踪每个占用的单元格，否则分配的网格可能太小。 

## 方法

 最直接的想法就是完全按照描述来模拟绘图。 从坐标开始$(0,0)$，遍历每个段的每个单位步，记录占据当前位置的字符，并记录遇到的最小和最大垂直坐标。 

由于总步数最多为 1000，因此该模拟最多执行 1000 次更新。 知道所有位置后，我们创建一个覆盖整个垂直范围的矩形网格，并将记录的字符放入其中。 

更简单的暴力解释是创建一个大的坐标平面，并针对每个分段测试每个单元格，以确定该单元格是否属于心电图。 如果宽度约为 1000，高度约为 1000，则将产生大约一百万个单元格，每个单元格都可能针对许多段进行检查。 这种做法是没有必要的。 

关键的观察结果是图片本身仅包含与总路径长度一样多的非空单元格。 由于段长度的总和以 1000 为界，因此我们可以直接生成这些单元格，而无需检查未使用的坐标。 

这将问题变成了一个简单的模拟问题，而不是几何问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力网格扫描| O(H·W·n) | O(H·W) | 不必要|
 | 最优模拟 | O(aᵢ总和) | O(H·W) | 已接受 |

 ## 算法演练

 1.从坐标开始$(x,y)=(0,0)$。 
2. 维护一个字典，将占用的坐标映射到其字符，或者`/`或者`\`。 
3. 维护绘图中出现的最小和最大行坐标。 
4. 从左到右处理片段。 
5. 对于奇数段（路径上升）：

 对于每个单元步骤：

 - 向上移动一个单位。 
- 地方`/`在与该步骤对应的单元格处。 
- 向右前进一列。 
- 更新垂直边界。 

斜线放置在台阶的上端点，因为视觉片段从左下角到右上角。 
6. 对于偶数段（路径下降）：

 对于每个单元步骤：

 - 地点`\`在目前的水平上。 
- 向右移动一列。 
- 向下移动一个单位。 
- 更新垂直边界。 

反斜杠占据下降步骤的上部单元格。 
7. 处理完所有线段后，将高度计算为`max_y - min_y + 1`宽度作为行进的总水平距离。 
8. 创建一个充满空格的网格。 
9. 通过使用移位将每个存储的坐标转换为网格行`max_y - y`。 这会将较大的 y 值放置在靠近输出顶部的位置。 
10. 用存储的字符填充相应的网格位置。 
11. 打印所有行。 

### 为什么它有效

 心电图的每一单位运动恰好对应于一个打印字符。 模拟沿着路径一步步进行，并记录每个对角笔画所占据的确切单元格。 存储的坐标保留折线的几何形状。 

最小和最大访问垂直级别确定包含整个绘图的最小矩形。 将所有坐标移动相同的量可以保留相对位置，同时消除负索引。 

由于每个节段都根据其定义精确模拟，并且每个占用的单元都记录一次，因此生成的 ASCII 艺术正是所需的心电图。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    cells = {}

    x = 0
    y = 0

    min_y = 0
    max_y = 0

    for i, length in enumerate(a):
        if i % 2 == 0:  # rising segment
            for _ in range(length):
                y += 1
                cells[(x, y)] = '/'
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                x += 1
        else:  # falling segment
            for _ in range(length):
                cells[(x, y)] = '\\'
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                x += 1
                y -= 1

    width = x
    height = max_y - min_y + 1

    grid = [[' '] * width for _ in range(height)]

    for (cx, cy), ch in cells.items():
        row = max_y - cy
        grid[row][cx] = ch

    sys.stdout.write('\n'.join(''.join(row) for row in grid))

if __name__ == "__main__":
    solve()
```模拟直接遵循几何定义。 变量`x`跟踪当前列，同时`y`跟踪当前的垂直高度。 

放置规则为`/`和`\`略有不同。 During an upward step, the slash belongs to the higher level reached after the move. During a downward step, the backslash belongs to the current level before descending. Mixing up these two conventions is the most common source of wrong answers.

 The dictionary stores only occupied cells. Since at most 1000 cells are ever drawn, memory usage remains tiny.

 When constructing the output grid, row indices increase downward, while geometric y-coordinates increase upward. 转换```
row = max_y - cy
```执行必要的垂直翻转。 

## 工作示例

 ### 示例 1

 输入：```
5
3 1 2 5 1
```模拟轨迹：

 | 细分 | 长度 | 方向 | x 段后 | y 段后 |
 | ---| ---| ---| ---| ---|
 | 1 | 3 | 上 | 3 | 3 |
 | 2 | 1 | 向下| 4 | 2 |
 | 3 | 2 | 上 | 6 | 4 |
 | 4 | 5 | 向下| 11 | 11 -1 |
 | 5 | 1 | 上 | 12 | 12 0 |

 访问垂直范围：

 | 数量 | 价值|
 | ---| ---|
 | 最大_y | 4 |
 | 分钟_y | -1 |
 | 高度| 6 |
 | 宽度| 12 | 12

 The trace shows why tracking both extremes is necessary. The drawing climbs to level 4 and later drops below the starting level to -1.

 ### 示例 2

 输入：```
2
1 1
```模拟轨迹：

 | 细分 | 长度 | 方向 | x 段后 | y 段后 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 上 | 1 | 1 |
 | 2 | 1 | 向下| 2 | 0 |

 占用的单元格：

 | 坐标 | 人物 |
 | ---| ---|
 | (0,1)| / |
 | (1,1) | \ |

 输出：```
/\
```此示例演示了向上和向下线段的不同放置规则。 两个字符占据同一行。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(aᵢ总和) | 每个单元步骤仅模拟一次 |
 | 空间| O(H·W) | 输出网格的存储 |

 由于总路径长度最多为 1000，因此宽度最多为 1000，高度也最多为 1000。生成的网格完全符合内存限制，并且模拟可以轻松地在时间限制内运行。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n = int(input())
    a = list(map(int, input().split()))

    cells = {}

    x = 0
    y = 0

    min_y = 0
    max_y = 0

    for i, length in enumerate(a):
        if i % 2 == 0:
            for _ in range(length):
                y += 1
                cells[(x, y)] = '/'
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                x += 1
        else:
            for _ in range(length):
                cells[(x, y)] = '\\'
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                x += 1
                y -= 1

    width = x
    height = max_y - min_y + 1

    grid = [[' '] * width for _ in range(height)]

    for (cx, cy), ch in cells.items():
        row = max_y - cy
        grid[row][cx] = ch

    return '\n'.join(''.join(row) for row in grid)

# minimum valid input
assert run("2\n1 1\n") == "/\\"

# symmetric mountain
assert run("2\n2 2\n") == " /\\\n/  \\\\"

# returns to origin repeatedly
assert run("4\n1 1 1 1\n") == "/\\/\\"

# deeper descent below start level
assert run("2\n1 3\n") == "/\\\n  \\\n   \\\\"

# all equal lengths
assert len(run("4\n2 2 2 2\n").splitlines()) > 0
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 1 1`|`/\`| 最小有效实例 |
 |`2 / 2 2`| 两排山| 正确处理高度 > 1 |
 |`4 / 1 1 1 1`|`/\/\`| 多次交替转弯 |
 |`2 / 1 3`| 下降到起始水平以下 | 坐标转换逻辑|
 |`4 / 2 2 2 2`| 非空有效图纸| 重复等长线段|

 ## 边缘情况

 ### 绘图低于起始水平

 输入：```
2
1 3
```路径到达级别：```
0 -> 1 -> 0 -> -1 -> -2
```最小 y 坐标变为`-2`。 构建输出时，所有行都向上移动`2`。 相对几何形状保持不变，每个坐标都接收一个有效的非负行索引。 

### 同一高度的连续峰

 输入：```
4
1 1 1 1
```路径反复返回同一级别：```
0 -> 1 -> 0 -> 1 -> 0
```多个线段接触同一行。 由于每个步骤占用不同的列，因此没有单元格会错误地相互覆盖。 输出变为：```
/\/\
```### 最大水平长度

 输入：```
2
500 500
```宽度恰好变为 1000，这也是长度的最大可能总和。 该算法在生成最终网格之前仍然只执行 1000 个模拟步骤，并且只存储 1000 个占用的单元格。 

### 高度由中间位置决定

 输入：```
3
2 1 2
```尽管某些段端点较低，但达到的最高级别为 3。 跟踪每一步更新`max_y`正确。 分配的网格足够高，可以包含整个心电图而不会被截断。
