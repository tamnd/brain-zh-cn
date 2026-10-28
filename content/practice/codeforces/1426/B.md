---
title: "CF 1426B - 对称矩阵"
description: "我们被要求确定是否可以使用（2 × 2）块来平铺（m × m）正方形，以便生成的正方形相对于其主对角线对称。 每个图块的四个单元格中都有固定的数字，并且不允许旋转。"
date: "2026-06-11T05:47:31+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1426
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 674 (Div. 3)"
rating: 900
weight: 1426
solve_time_s: 224
verified: true
draft: false
---

[CF 1426B - 对称矩阵](https://codeforces.com/problemset/problem/1426/B)

 **评分：** 900
 **标签：** 实施
 **求解时间：** 3m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定是否可以平铺\(m \times m\)方形使用\(2 \times 2\)平铺，以便生成的正方形相对于其主对角线对称。 每个图块的四个单元格中都有固定的数字，并且不允许旋转。 我们有无限数量的每种瓷砖类型。 这里的对称性意味着对于每对位置 \((i, j)\) 和 \((j, i)\)，值必须匹配。 

输入给我们\(t\)测试用例。 每个测试用例指定图块类型的数量\(n\)和正方形的大小\(m\)，后面按顺序是图块的定义。 每个图块分为两行，代表顶行和底行。 如果正方形可以对称平铺，则每个测试用例的输出仅为“是”，否则为“否”。 

看看约束条件，\(n\)和\(m\)都最多 100 个，并且最多有 100 个测试用例。 这立即表明每个测试用例的时间复杂度为 O(n cdot m)) 的任何解决方案都是可行的。 主要的微妙之处在于，对称性要求与平铺相结合意味着并非所有平铺组合都有效。 特别是，由于图块不能旋转，因此只有左右对角线单元可以与其镜像位置对齐的图块才可用于构造对称正方形。 

幼稚的方法可能会错过的边缘情况包括：\(m\)很奇怪。 如果\(m\)是奇数，对称平铺\(2 \times 2\)平铺是不可能的，因为中心行和列需要单个单元格宽度，而该宽度不能被\(2 \times 2\)瓦。 另一个微妙之处是我们不需要使用所有的图块； 我们只需要找到一个合适的图块，其非对角线单元可以与自身或另一个图块配对以保持对称性。 

## 方法

 暴力方法会尝试将每个图块放置在图中的每个位置。\(m \times m\)网格并检查对称性。 对于一个\(m \times m\)正方形，大约有 \((m/2)^2\) 个位置\(2 \times 2\)瓷砖。 和\(n\)瓦片，这会导致 O(n \cdot (m/2)^2)\) 运算，这在该问题的约束下是可行的，但构造整个矩阵并检查对称性是不必要的。 我们的见解是我们不需要模拟整个网格。 唯一重要的是：

 1.\(m\)必须是均匀的。 
2. 必须存在至少一个右上角值等于左下角值的图块。 这确保了瓷砖可以沿对角线相遇并保持对称性。 

这一观察将问题简化为检查奇偶校验\(m\)扫描图块以查找一对匹配的对角相邻单元格。 如果\(m\)是奇数，不可能对称平铺。 如果\(m\)是偶数，我们只需要找到至少一个具有非对角对称属性的图块即可。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 暴力破解（模拟平铺）| O(n * 平方米) | O(平方米) | 已接受但没有必要 |
 | 最优（奇偶校验+平铺检查）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量\(t\)。 迭代每个测试用例。 
2. 对于每个测试用例，读取图块类型的数量\(n\)和所需的正方形大小\(m\)。 
3. 初始化一个标志`found`作为假。 该标志将指示是否存在合适的图块。 
4. 对于每个图块，读取四个整数\(a, b, c, d\)分别代表左上角、右上角、左下角和右下角的数字。 
5. 检查是否\(b = c\)。 此条件确保瓷砖可以沿对角线形成对称瓷砖。 
6. 如果任何图块满足此条件，则设置`found`为真。 
7. 扫描所有图块后，如果`m`是奇数，输出“NO”，因为\(2 \times 2\)平铺不能对称地覆盖奇数维正方形。 
8.如果`m`是偶数并且`found`为True，输出“YES”； 否则输出“NO”。 

工作原理：矩阵的对称性减少了问题，以确保图块的非对角线单元可以沿对角线相交，并且正方形大小必须能被 2 整除才能容纳完整的单元格。\(2 \times 2\)瓷砖。 这个不变量保证了正确性，而无需构造整个矩阵。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    found = False
    for _ in range(n):
        a, b = map(int, input().split())
        c, d = map(int, input().split())
        if b == c:
            found = True
    if m % 2 != 0:
        print("NO")
    else:
        print("YES" if found else "NO")
```该解决方案使用有效地读取输入`sys.stdin.readline`。 我们保留一个简单的标志来检测合适的图块。 支票`m % 2 != 0`立即处理不可能的奇数长度正方形。 我们不会存放不必要的瓷砖，从而最大限度地减少空间使用。 

## 工作示例

 ### 示例 1

 输入：```
3 4
1 2
5 6
5 7
7 4
8 9
9 8
```加工：

 | 瓷砖| 一个 | 乙| c | d | b==c |
 |---|---|---|---|---|---|
 | 1 | 1 | 2 | 5 | 6 | 假 |
 | 2 | 5 | 7 | 7 | 4 | 真实|
 | 3 | 8 | 9 | 9 | 8 | 真实|`m = 4`（偶数），至少有一块瓷砖有`b == c`，所以输出“YES”。 

### 奇数尺寸示例

 输入：```
1 3
1 2
2 1
```

`m = 3`（奇），立即输出“NO”，无论图块内容如何。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 |---|---|---|
 | 时间 | O(t * n) | 我们在每个测试用例中检查每个图块一次 |
 | 空间| O(1) | O(1) | 只需要一个布尔标志 |

 该解决方案可以轻松满足最多 100 个测试用例和每个用例 100 个图块的 1 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        found = False
        for _ in range(n):
            a, b = map(int, input().split())
            c, d = map(int, input().split())
            if b == c:
                found = True
        if m % 2 != 0:
            print("NO")
        else:
            print("YES" if found else "NO")
    return output.getvalue().strip()

# provided samples
assert run("6\n3 4\n1 2\n5 6\n5 7\n7 4\n8 9\n9 8\n2 5\n1 1\n1 1\n2 2\n2 2\n1 100\n10 10\n10 10\n1 2\n4 5\n8 4\n2 2\n1 1\n1 1\n1 2\n3 4\n1 2\n1 1\n1 1") == "YES\nNO\nYES\nNO\nYES\nYES", "sample 1"

# custom cases
assert run("1\n1 2\n1 2\n2 3") == "YES", "single tile matching"
assert run("1\n1 2\n1 2\n3 4") == "NO", "single tile non-matching"
assert run("1\n2 3\n1 2\n2 1\n3 4\n4 3") == "NO", "odd square size"
assert run("1\n2 4\n1 2\n2 1\n3 4\n4 3") == "YES", "even square size, multiple tiles"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 | 1 2\n1 2\n2 3 | 是 | 单块瓷砖有`b==c`作品 |
 | 1 2\n1 2\n3 4 | 否 | 单瓦无`b==c`失败|
 | 2 3\n1 2\n2 1\n3 4\n4 3 | 3\n1 2\n2 1\n3 4\n4 3 否 | 奇怪的`m`无法平铺 |
 | 2 4\n1 2\n2 1\n3 4\n4 3 | 是 | 甚至`m`与匹配的瓷砖成功 |

 ## 边缘情况

 当正方形大小时，会出现一个重要的边缘情况\(m\)很奇怪。 例如，输入：```
1
1 3
1 2
2 1
```该算法首先检查 `m % 2 !=
