---
title: "CF 89B - 小部件库"
description: "我们被要求模拟一个微型 GUI 布局系统。 共有三种小部件。 普通 Widget 具有固定的宽度和高度。 HBox 和 VBox 是可以存储其他小部件的容器小部件。 HBox 水平放置子项，而 VBox 垂直放置它们。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "expression-parsing", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 89
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 74 (Div. 1 Only)"
rating: 2300
weight: 89
solve_time_s: 123
verified: true
draft: false
---

[CF 89B - 小部件库](https://codeforces.com/problemset/problem/89/B)

 **评分：** 2300
 **标签：** dp、表达式解析、图、实现
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一个微型 GUI 布局系统。 

共有三种小部件。 一个平原`Widget`有固定的宽度和高度。`HBox`和`VBox`是可以存储其他小部件的容器小部件。 一个`HBox`将孩子水平放置，而`VBox`将它们垂直放置。 

每个容器还有两个参数。`border`在内容的所有侧面添加空白填充。`spacing`添加连续子项之间的间隙。 

棘手的部分是容器存储对小部件的引用，而不是副本。 如果一个小部件后来由于更多的子项被装入其中而改变了大小，则该小部件出现的每个位置都会立即反映新的大小。 

输入是一系列脚本命令。 有些命令创建小部件，有些命令修改间距或边框，有些命令将小部件打包到容器中。 最后，我们必须按字典顺序打印每个小部件的最终宽度和高度。 

限制非常小。 最多有 100 条指令，并且小部件名称很短。 即使是反复重新计算许多尺寸的算法也能轻松地满足该限制。 真正的挑战是正确建模依赖结构并避免大小公式中的细微错误。 

打包关系保证是非循环的。 小部件永远不能间接包含其自身。 这个保证很重要，因为最终的大小形成了一个依赖图。 没有循环，每个小部件的大小都是明确定义的。 

一些边缘情况很容易被错误处理。 

一个空的`HBox`或者`VBox`总是有尺寸`0 x 0`，无论边框或间距如何。 

例如：```
3
HBox a
a.set_border(10)
a.set_spacing(20)
```正确输出：```
a 0 0
```即使没有孩子，粗心的实施也可能会应用边界公式并错误地产生`20 x 20`。 

间距仅出现在相邻小部件之间，而不是在第一个小部件之前或最后一个小部件之后。 

例如：```
4
HBox a
Widget x(10,5)
Widget y(20,5)
a.set_spacing(7)
a.pack(x)
a.pack(y)
```宽度为：```
10 + 20 + 7 = 37
```不是`44`。 因为只有两个小部件，所以只有一个间隙。 

另一个微妙的例子是共享小部件。```
5
Widget x(10,20)
HBox a
VBox b
a.pack(x)
b.pack(x)
```小部件`x`存在一次，但对两种布局都有贡献。 稍后更改为`x`必须自动影响两个容器。 将打包的小部件视为复制的对象会默默地破坏此行为。 

嵌套容器也需要递归计算。```
5
HBox outer
VBox inner
Widget x(10,20)
inner.pack(x)
outer.pack(inner)
```尺寸为`outer`取决于计算的大小`inner`，而不仅仅是其直接参数。 

## 方法

 最直接的方法是每当发生变化时从头开始重复重新计算尺寸。 

对于每个容器，我们可以递归地评估所有后代。 一个`HBox`对子宽度求和并取最大子高度。 一个`VBox`对子项高度求和并取最大子项宽度。 然后我们添加边框和间距贡献。 

这种暴力方法在这里实际上已经足够快了，因为最多有 100 条指令。 即使每次重新计算都会遍历所有小部件，总工作量仍然很小。 

简单递归实现的主要弱点不是性能而是正确性。 如果不小心编写递归，重复访问共享子树可能会产生不一致的结果。 循环也会导致无限递归，尽管问题保证它们永远不会出现。 

关键的观察是小部件结构形成有向无环图。 每个容器仅依赖于它的子容器。 由于没有循环，我们可以递归地定义每个小部件的大小。 

这让我们可以使用 DFS 和记忆来清晰地对问题进行建模。 

普通小部件已经知道它们的尺寸。 

对于容器：

 对于`HBox`:```
width  = sum(child widths) + spacing * (k - 1) + 2 * border
height = max(child heights) + 2 * border
```为了`VBox`:```
width  = max(child widths) + 2 * border
height = sum(child heights) + spacing * (k - 1) + 2 * border
```在哪里`k`是孩子的数量。 

特殊的空容器规则覆盖一切。 如果`k = 0`，答案正是`0 x 0`。 

由于该图是非循环的，因此 DFS 可以正确计算每个大小。 记忆化避免了多次重新计算同一子树。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力递归重新计算| O(N²) | O(N) | 已接受 |
 | 具有记忆功能的最佳 DFS | O(N + E) | O(N + E) | 已接受 |

 这里`N`是小部件的数量，`E`是包装关系的数量。 

## 算法演练

 1. 解析每条指令并构建小部件对象。 

每个小部件存储：`type`（`Widget`,`HBox`， 或者`VBox`）

 普通小部件的固定尺寸`border`

`spacing`打包儿童名单
 2. 对于创建命令，初始化相应的widget。 

普通小部件立即知道它们的宽度和高度。 
3.为了`pack()`命令，将子窗口小部件名称附加到父容器的子列表中。 

顺序很重要，因为间距取决于相邻性。 
4. 对于`set_border()`和`set_spacing()`命令，更新容器参数。 
5.定义DFS函数`solve(name)`返回最终结果`(width, height)`一个小部件的。 
6. 如果小部件是普通的`Widget`，立即返回其存储的尺寸。 
7.如果widget是空容器，则返回`(0, 0)`。 

这种特殊情况必须在应用边框或间距公式之前发生。 
8. 递归计算所有子项的大小。 
9. 如果小部件是`HBox`:

 1. 对所有子宽度求和。 
2. 添加间距乘以`(children_count - 1)`。 
3.添加`2 * border`。 
4. 取最大儿童身高并添加`2 * border`。 
10. 如果小部件是`VBox`:
 11. 将所有儿童的身高相加。 
12. 添加间距乘以`(children_count - 1)`。 
13. 添加`2 * border`。 
14. 获取最大子宽度并添加`2 * border`。 
15. 记住每个计算结果，这样重复引用同一个小部件就很便宜。 
16. 评估每个小部件并打印按字典顺序排序的结果。 

### 为什么它有效

 由于禁止自包含，因此打包结构是 DAG。 每个小部件的大小仅取决于该图中较低的后代。 

DFS 在计算父尺寸之前计算子尺寸，因此在评估容器时，每个所需的子尺寸都已经是正确的。 

公式完全符合布局规则：

 对于`HBox`，宽度水平累积，而高度则受到最高孩子的限制。 

为了`VBox`，高度垂直累积，而宽度则受到最宽子项的限制。 

连续小部件之间的间距贡献一次，这就是乘数的原因`(k - 1)`。 

空容器特殊情况直接与语句匹配，并防止边框或间距错误地影响空布局。 

由于每个小部件都是根据这些精确规则进行评估的，因此所有计算的尺寸都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    widgets = {}

    for _ in range(n):
        s = input().strip()

        if s.startswith("Widget "):
            rest = s[7:]
            name, dims = rest.split("(")
            dims = dims[:-1]

            w, h = map(int, dims.split(","))

            widgets[name] = {
                "type": "Widget",
                "w": w,
                "h": h,
                "border": 0,
                "spacing": 0,
                "children": []
            }

        elif s.startswith("HBox "):
            name = s[5:]

            widgets[name] = {
                "type": "HBox",
                "border": 0,
                "spacing": 0,
                "children": []
            }

        elif s.startswith("VBox "):
            name = s[5:]

            widgets[name] = {
                "type": "VBox",
                "border": 0,
                "spacing": 0,
                "children": []
            }

        elif ".pack(" in s:
            left, right = s.split(".pack(")
            child = right[:-1]

            widgets[left]["children"].append(child)

        elif ".set_border(" in s:
            left, right = s.split(".set_border(")
            val = int(right[:-1])

            widgets[left]["border"] = val

        elif ".set_spacing(" in s:
            left, right = s.split(".set_spacing(")
            val = int(right[:-1])

            widgets[left]["spacing"] = val

    memo = {}

    def dfs(name):
        if name in memo:
            return memo[name]

        node = widgets[name]

        if node["type"] == "Widget":
            ans = (node["w"], node["h"])
            memo[name] = ans
            return ans

        children = node["children"]

        if not children:
            memo[name] = (0, 0)
            return (0, 0)

        sizes = [dfs(child) for child in children]

        border = node["border"]
        spacing = node["spacing"]
        k = len(children)

        if node["type"] == "HBox":
            width = sum(w for w, h in sizes)
            width += spacing * (k - 1)
            width += 2 * border

            height = max(h for w, h in sizes)
            height += 2 * border

        else:
            width = max(w for w, h in sizes)
            width += 2 * border

            height = sum(h for w, h in sizes)
            height += spacing * (k - 1)
            height += 2 * border

        ans = (width, height)
        memo[name] = ans
        return ans

    for name in sorted(widgets):
        w, h = dfs(name)
        print(name, w, h)

solve()
```解析逻辑直接反映脚本语言。 每个小部件都成为一个包含其类型、布局参数和子列表的字典。 

递归`dfs`函数实现小部件尺寸的数学定义。 当同一个小部件被打包到多个容器中时，记忆字典可以防止重复计算。 

最重要的实现细节是空容器检查：```
if not children:
    return (0, 0)
```这必须在应用边框或间距之前发生。 否则是一个带边框的空容器`10`会错误地变成`20 x 20`。 

另一个微妙之处是间距公式：```
spacing * (k - 1)
```仅相邻小部件之间存在间隙。 有了一个孩子，差距就为零。 

递归是安全的，因为输入保证没有循环。 

## 工作示例

 ### 示例 1

 输入：```
12
Widget me(50,40)
VBox grandpa
HBox father
grandpa.pack(father)
father.pack(me)
grandpa.set_border(10)
grandpa.set_spacing(20)
Widget brother(30,60)
father.pack(brother)
Widget friend(20,60)
Widget uncle(100,20)
grandpa.pack(uncle)
```### 追踪

 | 步骤| 小部件 | 计算| 结果 |
 | --- | --- | --- | --- |
 | 1 | 我| 固定小部件| 50×40|
 | 2 | 兄弟| 固定小部件 | 30×60|
 | 3 | 叔叔| 固定小部件 | 100×20|
 | 4 | 父亲| 宽度 = 50 + 30，高度 = 最大值(40,60) | 80×60 |
 | 5 | 爷爷| 宽度 = 最大值(80,100) + 20 | 120 | 120
 | 6 | 爷爷| 高度 = 60 + 20 + 间距 20 + 边框 20 | 120 | 120

 最终输出：```
brother 30 60
father 80 60
friend 20 60
grandpa 120 120
me 50 40
uncle 100 20
```此示例演示了嵌套容器。`grandpa`取决于计算的大小`father`，这本身取决于`me`和`brother`。 

### 自定义示例

 输入：```
6
HBox a
a.set_border(5)
a.set_spacing(7)
Widget x(10,20)
Widget y(30,40)
a.pack(x)
a.pack(y)
```### 追踪

 | 步骤| 小部件 | 计算| 结果 |
 | --- | --- | --- | --- |
 | 1 | x| 固定小部件 | 10×20 | 10×20
 | 2 | y | 固定小部件 | 30×40|
 | 3 | 宽度| 10 + 30 + 7 + 10 | 10 + 30 + 7 + 10 | 57 | 57
 | 4 | 高度| 最大(20,40) + 10 | 50 | 50

 最终输出：```
a 57 50
x 10 20
y 30 40
```此示例显示边框和间距如何独立发挥作用。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N + E) | 每个小部件和包装边缘都会处理一次 |
 | 空间| O(N + E) | 小部件、子列表和记忆的存储 |

 由于最多有 100 条指令，该解决方案完全在限制之内。 即使重复的递归遍历也会通过，但记忆可以保持实现的干净并避免多余的工作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())

    widgets = {}

    for _ in range(n):
        s = input().strip()

        if s.startswith("Widget "):
            rest = s[7:]
            name, dims = rest.split("(")
            dims = dims[:-1]

            w, h = map(int, dims.split(","))

            widgets[name] = {
                "type": "Widget",
                "w": w,
                "h": h,
                "border": 0,
                "spacing": 0,
                "children": []
            }

        elif s.startswith("HBox "):
            name = s[5:]

            widgets[name] = {
                "type": "HBox",
                "border": 0,
                "spacing": 0,
                "children": []
            }

        elif s.startswith("VBox "):
            name = s[5:]

            widgets[name] = {
                "type": "VBox",
                "border": 0,
                "spacing": 0,
                "children": []
            }

        elif ".pack(" in s:
            left, right = s.split(".pack(")
            child = right[:-1]

            widgets[left]["children"].append(child)

        elif ".set_border(" in s:
            left, right = s.split(".set_border(")
            val = int(right[:-1])

            widgets[left]["border"] = val

        elif ".set_spacing(" in s:
            left, right = s.split(".set_spacing(")
            val = int(right[:-1])

            widgets[left]["spacing"] = val

    memo = {}

    def dfs(name):
        if name in memo:
            return memo[name]

        node = widgets[name]

        if node["type"] == "Widget":
            memo[name] = (node["w"], node["h"])
            return memo[name]

        children = node["children"]

        if not children:
            memo[name] = (0, 0)
            return memo[name]

        sizes = [dfs(c) for c in children]

        border = node["border"]
        spacing = node["spacing"]
        k = len(children)

        if node["type"] == "HBox":
            w = sum(x for x, y in sizes)
            w += spacing * (k - 1)
            w += 2 * border

            h = max(y for x, y in sizes)
            h += 2 * border

        else:
            w = max(x for x, y in sizes)
            w += 2 * border

            h = sum(y for x, y in sizes)
            h += spacing * (k - 1)
            h += 2 * border

        memo[name] = (w, h)
        return memo[name]

    out = []

    for name in sorted(widgets):
        w, h = dfs(name)
        out.append(f"{name} {w} {h}")

    return "\n".join(out)

# provided sample
assert run(
"""12
Widget me(50,40)
VBox grandpa
HBox father
grandpa.pack(father)
father.pack(me)
grandpa.set_border(10)
grandpa.set_spacing(20)
Widget brother(30,60)
father.pack(brother)
Widget friend(20,60)
Widget uncle(100,20)
grandpa.pack(uncle)
"""
) == (
"""brother 30 60
father 80 60
friend 20 60
grandpa 120 120
me 50 40
uncle 100 20"""
), "sample 1"

# single widget
assert run(
"""1
Widget a(5,7)
"""
) == (
"""a 5 7"""
), "single widget"

# empty container ignores border and spacing
assert run(
"""3
HBox a
a.set_border(10)
a.set_spacing(20)
"""
) == (
"""a 0 0"""
), "empty container"

# spacing counted only between widgets
assert run(
"""6
HBox a
Widget x(10,5)
Widget y(20,5)
a.set_spacing(7)
a.pack(x)
a.pack(y)
"""
) == (
"""a 37 5
x 10 5
y 20 5"""
), "spacing formula"

# nested layouts
assert run(
"""6
VBox root
HBox row
Widget x(10,20)
Widget y(30,40)
row.pack(x)
row.pack(y)
root.pack(row)
"""
) == (
"""root 40 40
row 40 40
x 10 20
y 30 40"""
), "nested containers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个小部件 | 保留固定尺寸 | 基本情况|
 | 空容器|`0 x 0`| 空布局忽略边​​框和间距 |
 | 两个带间距的小部件 | 正确的间隙计数| 间距公式中相差一
 | 嵌套布局 | 递归计算| 家长取决于孩子的大小 |

 ## 边缘情况

 ### 空容器

 输入：```
3
VBox a
a.set_border(5)
a.set_spacing(10)
```算法达到`a`，看到它的子列表为空，并立即返回`(0, 0)`。 

输出：```
a 0 0
```这可以防止边框和间距错误地影响空布局。 

### 有间隔的独生子女

 输入：```
4
HBox a
Widget x(10,20)
a.set_spacing(100)
a.pack(x)
```该算法计算：```
width = 10 + 100 * (1 - 1) = 10
```因为只有一个孩子，所以差距为零。 

输出：```
a 10 20
x 10 20
```这抓住了一个典型的错误，即为每个子元素添加一次间距，而不是为每个间隙添加一次。 

### 共享小部件

 输入：```
5
Widget x(10,20)
HBox a
VBox b
a.pack(x)
b.pack(x)
```DFS 计算`x`一次并记住它。 两个都`a`和`b`重复使用相同的尺寸。 

输出：```
a 10 20
b 10 20
x 10 20
```该算法正确地建模参考语义而不是复制小部件。 

### 深度嵌套

 输入：```
5
VBox a
HBox b
VBox c
Widget x(7,9)
c.pack(x)
b.pack(c)
a.pack(b)
```递归计算：```
x -> c -> b -> a
```每个父级都使用已经正确的子级尺寸。 

输出：```
a 7 9
b 7 9
c 7 9
x 7 9
```这证实了通过多个容器级别的递归传播可以正常工作。
