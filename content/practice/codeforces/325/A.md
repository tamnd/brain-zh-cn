---
title: "CF 325A - 正方形和长方形"
description: "我们在平面上最多有五个轴对齐的矩形。 每个矩形由其左下角和右上角坐标定义。 两个矩形不会重叠，尽管它们可能在边缘或拐角处接触。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 325
codeforces_index: "A"
codeforces_contest_name: "MemSQL start[c]up Round 1"
rating: 1500
weight: 325
solve_time_s: 260
verified: true
draft: false
---

[CF 325A - 正方形和矩形](https://codeforces.com/problemset/problem/325/A)

 **评分：** 1500
 **标签：** 实施
 **求解时间：** 4m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在平面上最多有五个轴对齐的矩形。 每个矩形由其左下角和右上角坐标定义。 两个矩形不会重叠，尽管它们可能在边缘或拐角处接触。 任务是确定这些矩形的并集是否恰好形成一个完美的正方形。 这意味着矩形覆盖的组合区域必须形成一个正方形，其边平行于轴，没有间隙或孔。 

矩形数量最多为五个的限制是至关重要的。 它使我们能够对所有可能的排列进行几何推理，而不是依赖于繁重的计算几何或网格模拟。 每个矩形的坐标以 31,400 为界，这确保了简单的算术或比较不会有 Python 中整数溢出的风险。 

不明显的边缘情况包括矩形仅在角处接触的布置、矩形形成内部有孔的正方形、或者矩形排列在非正方形的线上。 例如，三个矩形形成一个看起来像正方形一部分的 L 形，可能会误导仅基于边界坐标的简单检查。 

## 方法

 强力方法涉及创建一个足够大的二维布尔网格，以覆盖所有矩形的边界框，并标记位于任何矩形内的所有单元格。 然后，我们可以迭代网格来检查边界正方形内的所有单元格是否都被覆盖。 这是可行的，因为矩形的数量非常少，但它并不优雅，并且如果边界坐标接近最大值 31,400，则可能需要大量内存。 

最佳方法依赖于几何推理。 首先，我们通过找到最小的矩形来计算包含所有矩形的最小边界正方形`x1`和`y1`和最大的`x2`和`y2`。 如果该边界框的宽度和高度不相等，则矩形不能形成正方形。 如果它们相等，下一步是确保矩形的组合面积等于该边界正方形的面积。 如果各个矩形面积的总和与边界框的面积相匹配，并且不存在重叠（由问题陈述保证），则这些矩形恰好形成一个正方形。 

关键的见解是，对于少量不重叠的矩形，形成正方形的组合相当于它们的边界框是正方形并且它们的总面积与边界框面积匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力网格| O(S^2) 其中 S 是边界框 | 的边长 O(S^2) | O(S^2) | 有效但太过分了|
 | 几何边界+面积检查| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取矩形的个数`n`以及他们的坐标。 
2. 初始化`min_x`,`min_y`到无穷大和`max_x`,`max_y`为零。 这些将跟踪边界矩形。 
3. 初始化`total_area`为零。 这将计算所有矩形的面积之和。 
4. 迭代每个矩形。 对于每个带有坐标的矩形`(x1, y1, x2, y2)`， 更新`min_x`和`min_y`到它们当前值中较小的一个`x1`,`y1`。 更新`max_x`和`max_y`到它们当前值中的较大者和`x2`,`y2`。 添加`(x2 - x1) * (y2 - y1)`到`total_area`。 
5. 计算宽度`w = max_x - min_x`和身高`h = max_y - min_y`边界矩形的。 
6. 如果`w != h`，打印“NO”并终止。 否则，检查是否`total_area == w * h`。 如果为真，则打印“YES”； 否则，打印“NO”。 

该算法之所以有效，是因为矩形不重叠的不变性确保了对面积求和相当于计算并集面积。 检查边界框可确保形状是正方形。 如果区域匹配，则不会有间隙，因为矩形不能延伸到边界框之外，也不能重叠。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
min_x = float('inf')
min_y = float('inf')
max_x = 0
max_y = 0
total_area = 0

for _ in range(n):
    x1, y1, x2, y2 = map(int, input().split())
    min_x = min(min_x, x1)
    min_y = min(min_y, y1)
    max_x = max(max_x, x2)
    max_y = max(max_y, y2)
    total_area += (x2 - x1) * (y2 - y1)

width = max_x - min_x
height = max_y - min_y

if width != height or total_area != width * height:
    print("NO")
else:
    print("YES")
```代码直接实现了算法。 仔细处理边界框初始化可以避免从零开始的矩形出现错误。 使用`float('inf')`保证任何输入都会正确更新最小值。 对矩形面积求和是有效的，因为该问题保证不重叠，因此我们不会重复计算。 

## 工作示例

 对于示例输入：

 | 矩形| x1 | y1 | x2 | y2 | 总面积 | 最小_x | 分钟_y | 最大_x | 最大_y |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 0 | 2 | 3 | 6 | 0 | 0 | 2 | 3 |
 | 2 | 0 | 3 | 3 | 5 | 6 | 0 | 0 | 3 | 5 |
 | 3 | 2 | 0 | 5 | 2 | 6 | 0 | 0 | 5 | 5 |
 | 4 | 3 | 2 | 5 | 5 | 6 | 0 | 0 | 5 | 5 |
 | 5 | 2 | 2 | 3 | 3 | 1 | 0 | 0 | 5 | 5 |

 边界框宽度和高度：5，总面积：25。宽度等于高度，总面积等于 25，因此输出为 YES。 

另一个输入，其中矩形形成一条线：```
2
0 0 1 3
1 0 2 3
```边界框：宽度2，高度3，面积6，矩形面积和6。宽度！=高度，输出NO。 这表明即使总面积匹配，算法也能正确检测非正方形形状。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 单次遍历最多 5 个矩形，每个矩形进行恒定时间操作 |
 | 空间| O(1) | O(1) | 仅使用几个变量来跟踪边界框和总面积 |

 当 n ≤ 5 时，算法会立即运行，并且使用的内存可以忽略不计，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    min_x = float('inf')
    min_y = float('inf')
    max_x = 0
    max_y = 0
    total_area = 0

    for _ in range(n):
        x1, y1, x2, y2 = map(int, input().split())
        min_x = min(min_x, x1)
        min_y = min(min_y, y1)
        max_x = max(max_x, x2)
        max_y = max(max_y, y2)
        total_area += (x2 - x1) * (y2 - y1)

    width = max_x - min_x
    height = max_y - min_y

    return "YES" if width == height and total_area == width * height else "NO"

# provided samples
assert run("5\n0 0 2 3\n0 3 3 5\n2 0 5 2\n3 2 5 5\n2 2 3 3\n") == "YES", "sample 1"

# custom cases
assert run("1\n0 0 1 1\n") == "YES", "single rectangle square"
assert run("2\n0 0 1 2\n1 0 2 2\n") == "NO", "rectangles form rectangle, not square"
assert run("3\n0 0 2 1\n0 1 1 2\n1 1 2 2\n") == "YES", "L-shaped fills 2x2 square"
assert run("2\n0 0 3 3\n3 0 6 3\n") == "NO", "two rectangles side by side non-square"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 个矩形 1x1 | 是 | 最小输入，单个矩形形成正方形 |
 | 2 个矩形 1x2 + 1x2 | 否 | 矩形并集是矩形，不是正方形 |
 | 3 个矩形形成 2x2 L 形 | 是 | 面积和等于平方，检查角接触 |
 | 2 个并排的矩形 3x3 | 否 | 边界框为矩形，面积和匹配但不是正方形 |

 ## 边缘情况

 L 形排列表明仅在边缘或拐角处接触的矩形已得到正确处理。 该算法依赖于面积总和和边界框，因此它会自动拒绝有间隙的配置，例如两个矩形形成 2x1 +
