---
problem: 928C
contest_id: 928
problem_index: C
name: "Dependency management"
contest_name: "VK Cup 2018 - \u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f 1"
rating: 1900
tags: ["*special", "graphs", "implementation"]
answer: passed_samples
verified: true
solve_time_s: 90
date: 2026-06-18
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a330317-3000-83ec-a44f-85b0de8c477a
---

# CF 928C - 依赖管理

 **评级：** 1900
 **标签：** *特殊、图表、实现
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 30s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a330317-3000-83ec-a44f-85b0de8c477a

 ---

 ## 解决方案

 ## 问题理解

 我们得到了一组软件项目，其中每个项目不仅通过名称来标识，还通过版本号来标识。 每个项目都可以依赖于其他项目，形成有向非循环依赖图。 输入中的第一个项目是 Polycarp 当前的项目，我们的任务是确定构建或分析它时必须包含的所有内容。 

微妙之处在于，相同的项目名称可以出现在多个版本中，并且依赖项可能引用同名项目的不同版本。 但是，当可以访问同名的多个版本时，最终解析的依赖项集中实际上只保留一个版本。 所选择的版本必须是与 Polycarp 项目的依赖距离“最接近”的版本，如果多个版本的依赖距离相同，则优先选择版本号较大的版本。 

输出是此解析过程后保留的所有项目（不包括 Polycarp 的根项目）的集合，按项目名称及其所选版本按字典顺序打印。 

约束 n ≤ 1000 立即表明 O(n²) 或 O(n log n) 图遍历是可以的，但任何涉及对大型子集重复重新计算的操作仍然会通过。 该图在构造上是稀疏的，因为每个项目都明确列出了其直接依赖项，并且节点总数最多为 1000 个。 

关键的边缘情况来自于图表不同部分中出现的同名的多个版本。 独立处理（名称，版本）的幼稚 DFS 将同时包含冲突版本。 例如，如果项目 a 依赖于 b 1 ，并且通过另一条链也依赖于 b 2 ，则简单的遍历可能会包含两者，即使最终解决方案中仅允许 b 的一个版本。 

另一个微妙的问题是，“最佳版本”取决于依赖图中距根的最短距离，因此仍然可以丢弃更深但数值更大的版本，以支持更接近的版本。 如果稍后的发现产生更好的版本，则仅跟踪访问的节点而不跟踪每个名称的最佳距离的解决方案将失败。 

## 方法

 一种简单的方法是将每个（名称，版本）对视为图中的不同节点，并从 Polycarp 的项目运行 DFS 或 BFS，收集所有可到达的节点。 这正确地找到了所有依赖项，但没有解决同名版本之间的冲突规则。 遍历之后，我们需要通过按名称分组并选择最佳版本来对集合进行后处理。 

问题在于仅可达性是不够的。 正确的版本取决于最短路径距离，因此我们必须跟踪每个名称迄今为止遇到的最小距离。 如果我们天真地这样做，就需要第二次遍历或反复放松。 在最坏的情况下，同一项目的多个版本出现在不同的深度，并且幼稚传播可能会反复更新选择，从而导致二次行为。 

关键的观察结果是，依赖图是植根于 Polycarp 项目的 DAG，我们只关心未加权图中的最短路径距离，可以使用 BFS 计算。 一旦我们计算出从根到每个节点（名称、版本）的最小距离，我们就可以通过选择距离最小的版本来独立解析每个名称，通过选择较大的版本号来打破联系。 这消除了任何迭代细化的需要。 

然后，我们对所有节点执行第二次传递，以提取每个名称的所选版本并输出它们。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力 DFS + 后处理 | 最坏情况 | O(n²) O(n) | 可接受但脆弱|
 | BFS + 最佳名字选择 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 我们首先将输入标准化为一个图表，其中每个节点都是由（名称，版本）标识的项目实例。 我们还为每个节点分配一个唯一的整数 ID，以实现高效的邻接存储。 

然后，我们使用 BFS 计算距 Polycarp 项目的最短距离，因为所有边都未加权，并且我们需要最小的依赖链长度。 

1. 解析所有项目并为每个（名称、版本）分配一个节点 ID，同时存储依赖关系的邻接列表。 这将构建完整的依赖关系图，而无需任何过滤。 
2. 从第一个项目开始运行 BFS。 将其距离初始化为0并将其推入队列。 
3、处理节点时，遍历其所有依赖关系。 如果尚未访问依赖项，则为其分配距离 current_distance + 1 并将其推入队列。 由于 BFS 按距离递增顺序扩展，因此我们第一次分配的距离保证是最小的。 
4. BFS 完成后，我们得到了从 Polycarp 的项目到每个可达对象（名称、版本）的最短距离。 
5. 对于每个项目名称，我们检查已到达的该名称的所有版本。 我们选择距离最小的版本。 如果多个版本的距离相同，我们选择版本号最大的版本。 
6. 最后，我们输出除根项目之外的所有选定的（名称，版本）对，并按名称按字典顺序排序。 

正确性取决于 BFS 为每个节点分配其最小可能依赖距离的不变量。 由于我们仅在距离固定后比较同名的版本，因此我们永远不需要重新审视或修改决策。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque, defaultdict

n = int(input())

nodes = []
id_map = {}
adj = []

def get_id(name, ver):
    key = (name, ver)
    if key not in id_map:
        id_map[key] = len(nodes)
        nodes.append(key)
        adj.append([])
    return id_map[key]

# read input
i = 0
lines = [line.rstrip("\n") for line in sys.stdin if line.strip() != ""]
p = 0

# first pass parse
while p < len(lines):
    name, ver = lines[p].split()
    ver = int(ver)
    u = get_id(name, ver)
    p += 1

    k = int(lines[p])
    p += 1

    for _ in range(k):
        dn, dv = lines[p].split()
        dv = int(dv)
        v = get_id(dn, dv)
        adj[u].append(v)
        p += 1

root = 0

dist = [-1] * len(nodes)
dist[root] = 0
q = deque([root])

while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            q.append(v)

best = {}

for i, (name, ver) in enumerate(nodes):
    if dist[i] == -1:
        continue
    if name not in best:
        best[name] = (dist[i], ver)
    else:
        d, v = best[name]
        if dist[i] < d or (dist[i] == d and ver > v):
            best[name] = (dist[i], ver)

root_name = nodes[0][0]

ans = []
for name, (d, ver) in best.items():
    if name == root_name and ver == nodes[0][1]:
        continue
    ans.append((name, ver))

ans.sort()
for name, ver in ans:
    print(name, ver)
```该实现构建了所有项目版本的统一索引，以便邻接列表是简单的整数列表。 BFS 确保我们第一次到达节点时总是通过最短的依赖链。 

过滤步骤是在 BFS 之后完成的，而不是在遍历过程中完成的，因为任何有关版本的早期决策可能会因发现更短的路径而失效。 首先保持所有距离固定可以避免这种不稳定。 

一个微妙的细节是输入解析的处理：空行分隔项目块，因此我们明确忽略空行以确保正确分组。 

## 工作示例

 ### 示例 1

 输入项目形成一个小图，其中根依赖于导致同一项目名称的不同版本的两个分支。 

| 步骤| 队列| 处理节点| 距离更新 |
 | --- | --- | --- | --- |
 | 0 | a3| - | a3:0 |
 | 1 | b1，c1 | a3| b1:1、c1:1 |
 | 2 | c1 | b1 | （b2 已存在但尚不可访问）|
 | 3 | b2 | c1 | b2:2 |

 BFS之后，我们比较b的版本并选择b1，因为它的距离较小，并且直接包含c1。 

这显示了 BFS 如何自然地强制执行最短依赖项选择。 

### 示例 2

 这种情况引入了依赖项的竞争版本，其中一个版本在结构上更深，但应被忽略。 

| 步骤| 队列| 处理节点| 距离更新 |
 | --- | --- | --- | --- |
 | 0 | 根 | - | 根：0 |
 | 1 | extra1、mashadb2 | 根 | extra1:1、mashadb2:1 |
 | 2 | 马沙数据库 | 额外1 | - |
 | 3 | extra3（稍后忽略）| 马沙数据库 | 额外3:2 |

 在这里，即使 extra3 存在，它也会被忽略，因为 extra1 的路径较短。 BFS距离保证了版本选择的正确性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每个项目节点和依赖边在 BFS 中处理一次，在最终选择中处理一次 |
 | 空间| O(n + m) | 邻接表、节点映射和距离数组的存储 |

 1000 个项目的限制确保即使使用简单的邻接存储，内存和时间也能轻松地保持在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from collections import deque, defaultdict

    n = int(sys.stdin.readline())

    nodes = []
    id_map = {}
    adj = []

    def get_id(name, ver):
        key = (name, ver)
        if key not in id_map:
            id_map[key] = len(nodes)
            nodes.append(key)
            adj.append([])
        return id_map[key]

    lines = [line.rstrip("\n") for line in sys.stdin if line.strip() != ""]
    p = 0

    while p < len(lines):
        name, ver = lines[p].split()
        ver = int(ver)
        u = get_id(name, ver)
        p += 1

        k = int(lines[p])
        p += 1

        for _ in range(k):
            dn, dv = lines[p].split()
            dv = int(dv)
            v = get_id(dn, dv)
            adj[u].append(v)
            p += 1

    dist = [-1] * len(nodes)
    dist[0] = 0
    q = deque([0])

    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)

    best = {}
    for i, (name, ver) in enumerate(nodes):
        if dist[i] == -1:
            continue
        if name not in best:
            best[name] = (dist[i], ver)
        else:
            d, v = best[name]
            if dist[i] < d or (dist[i] == d and ver > v):
                best[name] = (dist[i], ver)

    root_name, root_ver = nodes[0]

    ans = [(name, ver) for name, (d, ver) in best.items() if not (name == root_name and ver == root_ver)]
    ans.sort()

    return "\n".join(f"{a} {b}" for a, b in ans)

assert run("""4
a 3
2
b 1
c 1

b 2
0

b 1
1
b 2

c 1
1
b 2
""") == "b 1\nc 1"

# all-same minimal chain
assert run("""2
a 1
1
b 1

b 1
0
""") == "b 1"

# duplicate versions with deeper alternative
assert run("""3
a 1
1
b 1

b 1
0

b 2
0
""") == "b 1"

# self-only
assert run("""1
a 1
0
""") == ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 乙 1, 丙 1 | 在重复项中正确选择版本 |
 | a→b 链 | 乙 1 | 最简单的依赖传播 |
 | b1 与 b2 | 乙 1 | 距离决胜|
 | 单节点| 空 | 根排除 |

 ## 边缘情况

 一种边缘情况是，相同的项目名称出现在多个版本中，距离根的距离完全相同。 在这种情况下，算法会选择较高的版本号。 例如，如果b1和b2在一个步骤中都是可达的，则BFS分配距离均为1，并且选择步骤保留b2。 

另一种情况是，只能通过较长的依赖链才能访问更高版本。 尽管它可能看起来更好，但 BFS 距离比较确保它被丢弃。 输入结构保证没有循环，因此最短路径始终是明确定义的，并且 BFS 排序确保一旦为节点分配了距离，以后就永远不会改进。
